# Step-by-Step Implementation Guide: Scalability & Monetization

This guide details how to implement the features described in `scalability_and_monetization.md`.

## Prerequisites

Ensure you have the following installed in your backend:
```bash
npm install stripe bullmq ioredis express-rate-limit nodemailer @pinecone-database/pinecone
```

And in your frontend:
```bash
npm install @stripe/react-stripe-js @stripe/stripe-js
```

---

## Part 1: Monetization (SaaS Model)

### Step 1: Database Updates (User Model)
Modify your User schema (`backend/src/models/User.js`) to track subscriptions and credits.
```javascript
const userSchema = new mongoose.Schema({
  // ... existing fields
  subscriptionTier: { 
    type: String, 
    enum: ['Free', 'Pro', 'Enterprise'], 
    default: 'Free' 
  },
  stripeCustomerId: { type: String },
  credits: { type: Number, default: 5 }, // For pay-as-you-go
  usageMetadata: {
    resumesUploaded: { type: Number, default: 0 },
    lastResetDate: { type: Date, default: Date.now }
  }
});
```

### Step 2: Stripe Integration
1.  **Setup**: Register on Stripe and get your Secret Key.
2.  **Endpoints**: Create `backend/src/controllers/paymentController.js`.
    *   **Create Customer**: When a user registers, create a Stripe Customer.
    *   **Checkout Session**: `POST /create-checkout-session` for upgrading to 'Pro'.
    *   **Webhook**: Listen for `checkout.session.completed` to update `subscriptionTier` in your DB.

### Step 3: Usage Limits Middleware
Create `backend/src/middleware/usageLimit.js`:
*   Check the user's tier.
*   **Free**: Max 10 uploads/month.
*   **Pro**: Max 500 uploads/month.
*   If limit exceeded, return `403 Upgrade Required`.

---

## Part 2: Scalability (Queues & Rate Limiting)

### Step 1: Rate Limiting
Protect your API from abuse by adding `express-rate-limit` in `backend/index.js`.
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later."
});

// Apply to all API routes
app.use('/api', limiter);
```

### Step 2: Async Processing with BullMQ
1.  **Redis**: Ensure you have a Redis server running (locally or cloud).
2.  **Queue Setup**: Create `backend/src/queues/resumeQueue.js`.
    ```javascript
    import { Queue } from 'bullmq';
    export const resumeQueue = new Queue('resume-processing', { connection: { host: 'localhost', port: 6379 } });
    ```
3.  **Worker**: Create a worker to process jobs in background.
    ```javascript
    import { Worker } from 'bullmq';
    const worker = new Worker('resume-processing', async job => {
      // Perform heavy PDF parsing and AI analysis here
      // Update Job status in MongoDB when done
    });
    ```
4.  **Refactor Upload API**: Instead of `await processResume()`, do `await resumeQueue.add('parse', { fileData })` and return a `jobId` immediately.

---

## Part 3: High-Value Features Implementation

### Feature A: Blind Hiring Mode
1.  **Job Model**: Add `blindMode: { type: Boolean, default: false }` to `backend/src/models/Job.js`.
2.  **Candidate Fetch**: In `getJobCandidates`, if `blindMode` is true:
    ```javascript
    candidates = candidates.map(c => ({
      ...c,
      name: "Candidate Hidden",
      email: "hidden@example.com",
      phone: "HIDDEN",
      // Remove other PII
    }));
    ```

### Feature B: Automated Interviewer Agent
1.  **Prompt**: Use OpenAI to act as an interviewer.
2.  **Flow**:
    *   Trigger: Recruiter clicks "Start AI Interview" for a candidate.
    *   System sends email to candidate with a unique link.
    *   Candidate opens link -> Chat Interface (Frontend).
    *   Backend: LangChain conversational chain asking questions based on the JD.

### Feature C: Email Outreach (One-Click)
1.  **Setup**: Configure `nodemailer` with an SMTP provider.
2.  **Controller**: `backend/src/controllers/outreachController.js`.
3.  **AI Generation**:
    *   Prompt: "Write a personalized recruiting email to ${candidate.name} for the role of ${job.title} at ${company.name}. Mention their skill in ${candidate.topSkill}."
4.  **Send**: Review generated text -> Click Send -> `transporter.sendMail()`.

---

## Part 4: Advanced Search (Vector Database)

### Step 1: Pinecone Setup
Initialize Pinecone client in `backend/src/config/pinecone.js`.

### Step 2: Embedding Generation
When a resume is parsed:
1.  Generate embedding for the `summary` or `skills` text using OpenAI `text-embedding-3-small`.
2.  Upsert execution to Pinecone:
    ```javascript
    await index.upsert([{
      id: candidateId,
      values: embeddingVector,
      metadata: { jobId: jobId }
    }]);
    ```

### Step 3: Semantic Search
Create a search endpoint that converts the query (e.g., "React developer with design skills") into a vector and queries Pinecone for the nearest neighbors.

---

## Order of Operations
I recommend implementing in this order:
1.  **Rate Limiting** (Quick win for security)
2.  **Monetization / Stripe** (Business foundation)
3.  **Redis/Queues** (When you start hitting performance bottlenecks)
4.  **High-Value Features** (One by one based on user demand)
