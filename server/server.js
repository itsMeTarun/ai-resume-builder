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

// OpenRouter API helper
async function generateWithOpenRouter(prompt) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
  const data = await response.json();
  console.log('OpenRouter response:', JSON.stringify(data, null, 2));
  if (!response.ok) {
    throw new Error(data.error?.message || 'OpenRouter API error');
  }
  if (!data.choices || !data.choices[0]?.message?.content) {
    throw new Error('Invalid response structure from OpenRouter');
  }
  return data.choices[0].message.content;
}

// Analyze Resume Endpoint
app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();

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

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Parse the JSON response
    let analysis;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw_analysis: response };
    } catch (e) {
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

    const prompt = `You are an expert resume writer. Based on the following resume content and target job title, create an improved version.

Target Job: ${jobTitle || 'General'}
Current Resume:
${resumeText}

Improvements requested: ${improvements || 'General improvements'}

IMPORTANT: Respond ONLY with valid JSON in this exact format, no other text:
{"improved_resume": "the improved resume text", "changes_explanation": "explanation of key changes made", "added_keywords": ["keyword1", "keyword2"]}`;

    const response = await generateWithOpenRouter(prompt);

    let parsedResult;
    try {
      if (!response) {
        throw new Error('Empty response from API');
      }
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      parsedResult = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw_response: response };
    } catch (e) {
      console.error('Parse error:', e, 'Response was:', response);
      parsedResult = { raw_response: response || 'No response received' };
    }

    res.json(parsedResult);
  } catch (error) {
    console.error('Build error:', error);
    res.status(500).json({ error: 'Failed to build resume' });
  }
});

// Generate Cover Letter Endpoint
app.post('/api/cover-letter', async (req, res) => {
  try {
    const { resumeText, jobTitle, companyName } = req.body;

    const prompt = `You are an expert cover letter writer. Write a professional cover letter based on:

    Resume: ${resumeText}
    Target Job: ${jobTitle}
    Company: ${companyName || 'the company'}

    Provide in JSON format:
    {
      "cover_letter": "the full cover letter",
      "key_points": ["key points highlighted"]
    }`;

    const response = await generateWithOpenRouter(prompt);

    let parsedResult;
    try {
      if (!response) {
        throw new Error('Empty response from API');
      }
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      parsedResult = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw_response: response };
    } catch (e) {
      console.error('Parse error:', e, 'Response was:', response);
      parsedResult = { raw_response: response || 'No response received' };
    }

    res.json(parsedResult);
  } catch (error) {
    console.error('Cover letter error:', error);
    res.status(500).json({ error: 'Failed to generate cover letter' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});