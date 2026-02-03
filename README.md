# Lead Generation Website

A production-ready, premium lead generation website built with React, Vite, Tailwind CSS, Framer Motion, and Lottie animations. Designed for easy deployment and CRM integration.

## 🚀 Features

- **Modern Tech Stack**: React 18, Vite, Tailwind CSS
- **Premium Animations**: Framer Motion page transitions & micro-interactions
- **Lottie Graphics**: Lightweight, scalable animations
- **Mobile-First Design**: Fully responsive across all devices
- **SEO Optimized**: Meta tags, Open Graph, semantic HTML
- **Accessible**: ARIA labels, keyboard navigation, semantic structure
- **3 CRM Integration Methods**: Embedded forms, webhooks, or serverless functions
- **Analytics Ready**: Google Tag Manager integration
- **WhatsApp Integration**: Direct chat functionality
- **Form Validation**: Client-side validation with clear error messages
- **Performance Optimized**: Code splitting, lazy loading, optimized bundle

## 📁 Project Structure

```
├── api/                    # Serverless functions
│   └── submit.js          # Form submission handler
├── public/                # Static assets
│   ├── lottie/           # Lottie animation files
│   └── robots.txt        # SEO configuration
├── src/
│   ├── components/       # React components
│   │   ├── Button.jsx
│   │   ├── Footer.jsx
│   │   ├── LeadForm.jsx
│   │   ├── Navbar.jsx
│   │   ├── SEO.jsx
│   │   ├── ServiceCard.jsx
│   │   └── SuccessModal.jsx
│   ├── config/          # Configuration
│   │   └── env.js       # Environment variables
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   └── Services.jsx
│   ├── utils/           # Utility functions
│   │   ├── analytics.js
│   │   ├── crm.js
│   │   └── validation.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── .env.example         # Environment variables template
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## 🛠️ Installation

### Prerequisites

You need to have Node.js installed on your computer. If you don't have it:

1. Go to [nodejs.org](https://nodejs.org/)
2. Download the LTS (Long Term Support) version
3. Install it by following the installer instructions

To check if Node.js is installed, open Command Prompt and type:
```bash
node --version
npm --version
```

### Step 1: Install Dependencies

Open Command Prompt in the project folder and run:

```bash
npm install
```

This will download all the required packages (may take a few minutes).

## ⚙️ Environment Variables Setup

**IMPORTANT**: The website needs configuration before it will work. Don't worry, this is easy!

### Step 1: Create the .env File

1. In the project folder, you'll see a file called `.env.example`
2. Make a copy of this file
3. Rename the copy to `.env` (just `.env` - remove the `.example` part)

### Step 2: Fill in Your Configuration

Open the `.env` file in Notepad. You'll see something like this:

```env
# CRM Integration - Choose ONE method below

# Method 1: Embedded CRM Form (e.g., HubSpot, Salesforce widget)
VITE_CRM_EMBED_CODE=

# Method 2: Direct Webhook to CRM
VITE_CRM_WEBHOOK_URL=

# Method 3: Serverless Function (Recommended for this project)
VITE_CRM_API_ENDPOINT=https://your-crm.com/api/leads
VITE_CRM_API_KEY=your_api_key_here

# Analytics
VITE_GTM_ID=

# WhatsApp Integration
VITE_WHATSAPP_NUMBER=
```

### What Each Setting Means (Beginner-Friendly Explanation)

#### **CRM Integration** - Where form submissions go

You only need to set up ONE of these three methods:

**Method 1: Embedded CRM Form** (Easiest if your CRM provides a widget)
- Some CRMs like HubSpot give you a snippet of code to paste
- If you have this, paste the entire code after `VITE_CRM_EMBED_CODE=`
- Example use case: "My marketing team gave me a HubSpot form code"

**Method 2: Direct Webhook** (Good for services like Zapier)
- If you're using Zapier, Make.com, or similar automation tools
- They'll give you a URL like `https://hooks.zapier.com/hooks/catch/12345/abcdef`
- Paste that URL after `VITE_CRM_WEBHOOK_URL=`
- Example: `VITE_CRM_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/12345/abcdef`

**Method 3: Serverless Function** (Recommended - most flexible)
- This is the method that uses the `/api/submit.js` file
- You need two things:
  1. **CRM API Endpoint**: The URL where your CRM accepts new leads
     - Example: `https://api.yourcrm.com/v1/leads`
  2. **CRM API Key**: Your secret key to access the CRM
     - Example: `sk_live_abc123def456`
- Fill them in like this:
```env
VITE_CRM_API_ENDPOINT=https://api.yourcrm.com/v1/leads
VITE_CRM_API_KEY=sk_live_abc123def456
```

#### **Google Tag Manager** (Optional - for tracking)
- If you want to track visits and conversions with Google Analytics
- Get your GTM ID from Google Tag Manager (looks like `GTM-XXXXXX`)
- Example: `VITE_GTM_ID=GTM-ABC1234`
- Leave empty if you don't have this yet

#### **WhatsApp Number** (Optional - for chat button)
- If you want a "Chat on WhatsApp" button in the footer
- Enter your WhatsApp number in international format (no + or spaces)
- For India: `919876543210` (91 is country code, then your 10-digit number)
- For USA: `12025551234` (1 is country code, then your number)
- Example: `VITE_WHATSAPP_NUMBER=919876543210`

### Quick Example - Fully Configured .env

Here's what a complete `.env` might look like:

```env
# Using serverless function method
VITE_CRM_API_ENDPOINT=https://api.pipedrive.com/v1/leads
VITE_CRM_API_KEY=abc123def456ghi789

# Google Tag Manager for analytics
VITE_GTM_ID=GTM-ABC1234

# WhatsApp for India
VITE_WHATSAPP_NUMBER=919876543210
```

### Important Notes About .env

- ⚠️ **Never share your .env file** - It contains secret keys!
- ⚠️ **Don't commit it to Git** - It's already in `.gitignore` to prevent this
- ✅ Every time you change `.env`, restart the development server

## 🏃‍♂️ Running Locally

Once you've set up your `.env` file:

```bash
npm run dev
```

This starts a local development server. You'll see a message like:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open your browser and go to `http://localhost:5173/` to see your website!

### Stopping the Server

Press `Ctrl + C` in the Command Prompt window.

## 🏗️ Building for Production

When you're ready to deploy:

```bash
npm run build
```

This creates a `dist` folder with optimized files ready for deployment.

## 🌐 Deployment

### Deploying to Netlify

#### Option A: Using Netlify CLI (Command Line)

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login to Netlify**
```bash
netlify login
```

3. **Deploy**
```bash
netlify deploy --prod
```

4. **Set Environment Variables**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Select your site
   - Go to Site settings → Environment variables
   - Add each variable from your `.env` file
   - Click "Save"

#### Option B: Using Netlify Website (Easier for Beginners)

1. **Create Account**
   - Go to [netlify.com](https://www.netlify.com)
   - Sign up (free)

2. **Deploy from Folder**
   - Run `npm run build` on your computer
   - In Netlify dashboard, click "Add new site" → "Deploy manually"
   - Drag and drop the `dist` folder

3. **Set Environment Variables**
   - In your site settings
   - Go to "Environment variables"
   - Add all variables from your `.env` file one by one:
     - Variable name: `VITE_CRM_API_ENDPOINT`
     - Value: `https://api.yourcrm.com/v1/leads`
     - Click "Create variable"
   - Repeat for all variables

4. **Redeploy**
   - After adding environment variables, trigger a redeploy
   - Build & deploy → Trigger deploy → Deploy site

### Deploying to Vercel

#### Option A: Using Vercel CLI

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login**
```bash
vercel login
```

3. **Deploy**
```bash
vercel --prod
```

4. **Add Environment Variables**
```bash
vercel env add VITE_CRM_API_ENDPOINT
# Paste your value when prompted
# Repeat for each variable
```

#### Option B: Using Vercel Website (Easier for Beginners)

1. **Create Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub (or email)

2. **Import Project**
   - Click "Add New Project"
   - Import your Git repository
   - Or click "Deploy" and drag your folder

3. **Configure Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variables**
   - During setup or later in Settings → Environment Variables
   - Add each variable from your `.env`:
   ```
   Name: VITE_CRM_API_ENDPOINT
   Value: https://api.yourcrm.com/v1/leads
   ```
   - Make sure to check all environments (Production, Preview, Development)

5. **Deploy**
   - Click "Deploy"
   - Wait a few minutes
   - Your site will be live!

## 🌍 Connecting a Custom Domain

### On Netlify

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Enter your domain (e.g., `www.yoursite.com`)
4. Follow DNS instructions:
   - If domain is from Netlify: Automatic
   - If external domain: Add DNS records they provide

### On Vercel

1. Go to your project → Settings → Domains
2. Enter your domain
3. Configure DNS:
   - Add A record: `76.76.21.21`
   - Or CNAME record to your Vercel URL
4. Wait for DNS propagation (can take up to 48 hours)

## 🧪 Testing CRM Lead Flow

### Method 1: Test Locally

1. Start the development server: `npm run dev`
2. Fill out the contact form
3. Check your browser's console (F12 → Console tab) for any errors
4. If using serverless method, the local submission might fail (that's normal)

### Method 2: Test After Deployment

1. Deploy your site to Netlify or Vercel
2. Fill out the form on your live site
3. Check your CRM to see if the lead appeared
4. If it doesn't work:
   - Check environment variables are set correctly
   - Check serverless function logs in Netlify/Vercel dashboard
   - Make sure your CRM API endpoint is correct

### Method 3: Test with a Webhook Testing Tool

If using webhook method:

1. Go to [webhook.site](https://webhook.site)
2. Copy the unique URL they give you
3. Temporarily use it as your `VITE_CRM_WEBHOOK_URL`
4. Submit a form
5. See the data appear on webhook.site
6. This confirms the form is working!

## 🎨 Customizing Lottie Animations

The project uses placeholder Lottie animations. Here's how to replace them:

### Finding Lottie Animations

1. Go to [LottieFiles.com](https://lottiefiles.com)
2. Search for animations (e.g., "business", "technology", "rocket")
3. Download the JSON file (free account required)

### Replacing the Hero Animation

1. Download your chosen Lottie animation
2. Save it as `hero-animation.json`
3. Replace the file in `public/lottie/hero-animation.json`
4. The website will automatically use the new animation!

### Recommended Lottie Search Terms

- "business growth"
- "rocket launch"
- "target achievement"
- "data analytics"
- "customer service"
- "mobile app"

## 🔧 Troubleshooting

### "npm: command not found"

**Problem**: Node.js isn't installed or not in PATH

**Solution**: 
- Download and install Node.js from [nodejs.org](https://nodejs.org)
- Restart your computer
- Try again

### Form Submissions Not Reaching CRM

**Problem**: Environment variables not configured

**Solution**:
- Double-check your `.env` file exists and has the right values
- Make sure there are no spaces around the `=` sign
- Restart the development server after changing `.env`
- On Netlify/Vercel, verify environment variables are set in dashboard

### Build Errors

**Problem**: Dependencies not installed

**Solution**:
```bash
rm -rf node_modules
npm install
```

### Page is Blank After Deployment

**Problem**: Environment variables missing in production

**Solution**:
- Go to your hosting platform (Netlify/Vercel)
- Add all environment variables from `.env`
- Redeploy the site

## 📊 Performance Optimization

The site is already optimized with:

- ✅ Code splitting (separate chunks for React, animations)
- ✅ Lazy loading for Lottie animations
- ✅ Optimized images (use WebP format)
- ✅ Minified CSS and JavaScript
- ✅ Fast font loading (Google Fonts)

### Additional Optimizations

1. **Optimize Images**: Use tools like [TinyPNG](https://tinypng.com)
2. **Enable Caching**: Netlify/Vercel do this automatically
3. **Use CDN**: Netlify/Vercel provide global CDN

## 📈 Analytics Setup (Optional)

### Setting Up Google Tag Manager

1. Create account at [tagmanager.google.com](https://tagmanager.google.com)
2. Create a container for your website
3. Copy your GTM ID (looks like `GTM-XXXXXX`)
4. Add to `.env`:
```env
VITE_GTM_ID=GTM-XXXXXX
```
5. In GTM, add Google Analytics tag
6. Publish the container

Now the site will automatically track:
- Page views
- Form submissions
- Button clicks

## 🆘 Getting Help

If you're stuck:

1. **Check the error message** - Often it tells you exactly what's wrong
2. **Browser console** - Press F12 and check the Console tab for errors
3. **Deployment logs** - Check Netlify/Vercel deployment logs
4. **Environment variables** - 90% of issues come from misconfigured variables

## 📝 License

This project is licensed under the MIT License.

## 🙏 Credits

Built with:
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lottie React](https://github.com/Gamote/lottie-react)
- [React Router](https://reactrouter.com/)

---

**Need more help?** Check the comments in the code files - they explain what each part does!
