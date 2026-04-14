const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(cors());
app.use(express.json());

function extractAndCleanJSON(response) {
  try {
    if (!response) throw new Error("Empty response");

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");

    let cleanJson = jsonMatch[0]
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      .trim();

    return JSON.parse(cleanJson);
  } catch (err) {
    console.error("❌ JSON CLEAN ERROR:", err);
    console.error("❌ Original response:", response);
    return null;
  }
}

// OpenRouter API helper
async function generateWithOpenRouter(prompt) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      signal: controller.signal,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:5000',
        'X-Title': 'AI Resume Builder'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3-8b-instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', response.status, errorData);
      throw new Error(errorData.error?.message || `OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenRouter response received');

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error('Invalid response structure from OpenRouter:', data);
      throw new Error('Invalid response structure from OpenRouter');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter fetch error:', error);
    throw error;
  }
}

// Analyze Resume Endpoint
app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  try {
    console.log('Analyze endpoint called');

    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    console.log(`File uploaded: ${req.file.originalname}, type: ${fileExt}`);

    let resumeText = '';

    if (fileExt === '.pdf') {
      const pdf = require('pdf-parse');
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      resumeText = data.text;
    } else if (fileExt === '.txt') {
      resumeText = fs.readFileSync(filePath, 'utf-8');
    } else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'Unsupported file format. Use PDF or TXT' });
    }

    // Analyze with OpenRouter
    const prompt = `You are an expert resume analyzer. Analyze the following resume and provide a detailed report in JSON format with these fields:
    {
      "score": (overall resume quality score 0-100),
      "strengths": ["list of strengths"],
      "weaknesses": ["list of areas to improve"],
      "suggestions": ["specific improvement suggestions"],
      "keywords_found": ["important keywords missing"],
      "ATS_score": (ATS compatibility score 0-100),
      "job_recommendations": ["recommended job titles"]
    }

    Resume content:
    ${resumeText}`;

    const response = await generateWithOpenRouter(prompt);
    console.log('AI response received, length:', response?.length || 0);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Parse the JSON response using the cleaner function
    let analysis = extractAndCleanJSON(response);
    if (!analysis) {
      analysis = { raw_analysis: response };
    }

    res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

// Build/Improve Resume Endpoint
app.post('/api/build', async (req, res) => {
  try {
    const { resumeText, jobTitle, improvements } = req.body;

    const prompt = `
You are an expert resume writer.

IMPORTANT RULES:
- Return ONLY valid JSON
- Do NOT include markdown (no \`\`\`)
- Do NOT include headings or extra text
- Ensure JSON is perfectly parseable

STRICT FORMAT:
{
  "improved_resume": "string",
  "changes_explanation": "string",
  "added_keywords": ["string", "string"]
}

Target Job: ${jobTitle || 'General'}

Current Resume:
${resumeText}

Improvements requested:
${improvements || 'General improvements'}
`;

    const response = await generateWithOpenRouter(prompt);

    let parsedResult;

    try {
      if (!response) {
        throw new Error('Empty response from API');
      }

      // 🔥 Extract JSON safely
      const jsonMatch = response.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      let cleanJson = jsonMatch[0];

      // 🔥 Clean common AI issues
      cleanJson = cleanJson
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .replace(/,\s*}/g, '}')     // trailing commas
        .replace(/,\s*]/g, ']')     // trailing commas in arrays
        .replace(/[\n\r]/g, ' ')    // remove line breaks
        .trim();

      parsedResult = JSON.parse(cleanJson);

      // 🔥 Ensure structure always exists
      parsedResult = {
        improved_resume: parsedResult.improved_resume || '',
        changes_explanation: parsedResult.changes_explanation || '',
        added_keywords: parsedResult.added_keywords || []
      };

    } catch (e) {
      console.error('Parse error:', e, 'Response was:', response);

      // 🔥 Safe fallback (never break frontend)
      parsedResult = {
        improved_resume: response || 'No response generated',
        changes_explanation: 'Could not parse structured response',
        added_keywords: []
      };
    }

    res.json(parsedResult);

  } catch (error) {
    console.error('Build error:', error);
    res.status(500).json({ error: 'Failed to build resume' });
  }
});

app.post('/api/create-resume', async (req, res) => {
  try {
    const formData = req.body;

    const prompt = `
You are an expert resume writer.

STRICT RULES:
- ONLY return valid JSON
- NO markdown
- NO explanations
- JSON must start with { and end with }

FORMAT:
{
  "resume": {
    "name": "string",
    "contact": {
      "email": "string",
      "phone": "string",
      "location": "string",
      "linkedin": "string",
      "portfolio": "string"
    },
    "summary": "string",
    "skills": ["string"],
    "experience": [
      {
        "company": "string",
        "position": "string",
        "duration": "string",
        "description": ["string"]
      }
    ],
    "education": [
      {
        "school": "string",
        "degree": "string",
        "year": "string"
      }
    ],
    "certifications": ["string"]
  },
  "cover_letter": "string"
}

USER DATA:
${JSON.stringify(formData)}
`;

    const raw = await generateWithOpenRouter(prompt);

    const parsed = extractAndCleanJSON(raw);

    if (!parsed) {
      return res.status(500).json({
        error: "AI parsing failed",
        raw
      });
    }

    res.json(parsed);

  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ error: 'Failed to create resume' });
  }
});

// Generate Cover Letter Endpoint
app.post('/api/cover-letter', async (req, res) => {
  try {
    const { resumeText, jobTitle, companyName } = req.body;

    const prompt = `
You are an expert cover letter writer.

STRICT RULES:
- Return ONLY valid JSON
- No markdown
- No explanation
- JSON must start with { and end with }

FORMAT:
{
  "cover_letter": "string",
  "key_points": ["string"]
}

Resume: ${resumeText}
Job: ${jobTitle}
Company: ${companyName || 'the company'}
`;

    const raw = await generateWithOpenRouter(prompt);

    // ✅ USE YOUR CLEANER (BEST FIX)
    const parsed = extractAndCleanJSON(raw);

    if (!parsed) {
      return res.status(500).json({
        error: "Parsing failed",
        raw
      });
    }

    // ✅ ALWAYS RETURN SAFE STRUCTURE
    res.json({
      cover_letter: parsed.cover_letter || '',
      key_points: parsed.key_points || []
    });

  } catch (error) {
    console.error('Cover letter error:', error);
    res.status(500).json({ error: 'Failed to generate cover letter' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔑 OpenRouter API key: ${process.env.OPENROUTER_API_KEY ? '✓ Present' : '✗ Missing'}`);
  console.log(`📁 Upload directory: ${__dirname}/uploads`);
});