# Comfort & Pondlike - GitHub Pages Deployment via Termux on Android

## Overview
This comprehensive guide will walk you through the entire process of deploying your "Comfort & Pondlike" website to GitHub Pages directly from your Android device using Termux. We will cover everything from setting up your GitHub repository and Termux environment to pushing your website files and configuring GitHub Pages for live access. This guide is designed for users who want to manage their web projects entirely from their mobile device.

## Prerequisites
-   An Android smartphone or tablet with sufficient storage space.
-   A stable internet connection.
-   A GitHub account (free tier is sufficient for public repositories).
-   The "Comfort & Pondlike" website project files (HTML, CSS, JavaScript, images, etc.). You should have these files ready on your Android device, perhaps in your Downloads folder or a dedicated project folder.

## Phase 1: Guide GitHub Repository Creation and Initial Setup

Before we touch Termux, the first crucial step is to set up your repository on GitHub. This will be the central place where your website's code resides and from where GitHub Pages will serve your site.

### 1.1 Create a New Repository on GitHub

1.  **Open your web browser** (on your Android device or a computer) and navigate to [GitHub.com](https://github.com).
2.  **Sign in** to your GitHub account. If you don't have one, sign up for free.
3.  Once logged in, locate the **"+" icon** in the top-right corner of the page (or click on your profile picture and select "Your repositories" then "New"). Click it and select **"New repository"** [1].

    <img src="https://docs.github.com/assets/images/help/repository/create-repository-button.png" alt="Create new repository button on GitHub" width="600"/>

4.  On the "Create a new repository" page, fill in the following details:
    -   **Owner**: This will be your GitHub username or an organization you belong to.
    -   **Repository name**: This is very important for GitHub Pages.
        -   **For a User or Organization Site**: If you want your website to be accessible directly at `https://yourusername.github.io/` (e.g., `https://johndoe.github.io/`), the repository name **must** be exactly `yourusername.github.io` (replace `yourusername` with your actual GitHub username). There can only be one such repository per user/organization.
        -   **For a Project Site**: If you want your website to be accessible at `https://yourusername.github.io/yourrepositoryname/` (e.g., `https://johndoe.github.io/comfort-pondlike/`), you can name the repository anything you like. For this guide, we will use `comfort-pondlike` as the repository name.

        *Recommendation*: For the 


Comfort & Pondlike website, a **Project Site** is generally more suitable, so we will proceed with naming the repository `comfort-pondlike`.

    -   **Description** (Optional): Add a brief, descriptive summary of your website (e.g., "Comfort & Pondlike E-commerce Website").
    -   **Public/Private**: Select `Public`. GitHub Pages only works with public repositories on the free tier. If you choose `Private`, you will need a GitHub Pro subscription to use GitHub Pages.
    -   **Initialize this repository with a README**: You can check this option. It will create a `README.md` file, which is good practice for any repository.
    -   **Add .gitignore**: Select `Node` from the dropdown if you plan to include the admin panel code, as it will help ignore unnecessary files like `node_modules`.
    -   **Add a license**: Optional, but recommended for open-source projects.

5.  Click the green **"Create repository"** button.

    <img src="https://docs.github.com/assets/images/help/repository/create-repository.png" alt="Create repository form on GitHub" width="600"/>

    Your new GitHub repository is now created and ready to receive your website files.

### 1.2 Download and Prepare Your Website Files

Ensure you have the `comfort-pondlike` website files (the `index.html`, `css/`, `js/`, `images/` folders, etc.) readily available on your Android device. You might have received them as a `.zip` file. If so, extract them to a location you can easily access, such as your device's `Downloads` folder or a dedicated `WebProjects` folder. We will transfer these files into the Termux environment in a later step.

## Phase 2: Refine Termux Setup and Git Configuration

Now that your GitHub repository is ready, let's prepare your Android device by setting up Termux and configuring Git within it. Termux provides a Linux-like command-line environment on your Android device, allowing you to use powerful tools like Git.

### 2.1 Install Termux

1.  **Download Termux**: The most reliable and up-to-date version of Termux is available from **F-Droid**, an open-source app store for Android. The version on the Google Play Store is often outdated and may have issues [2].
    -   Open your web browser on your Android device and go to the [F-Droid Termux page](https://f-droid.org/packages/com.termux/).
    -   Download the latest `.apk` file.
    -   Once downloaded, tap on the `.apk` file to install it. You might need to grant permission to install apps from unknown sources in your Android settings (usually found under `Settings > Apps & notifications > Special app access > Install unknown apps`).

2.  **Initial Setup**: Open the Termux app. It will automatically start the initial setup process, downloading and installing the base system. This might take a few minutes, depending on your internet speed. Ensure you have a stable connection.

### 2.2 Update Termux Packages

It's good practice to update all installed packages to their latest versions immediately after installation. This ensures you have the most recent features and security patches.

```bash
pkg update && pkg upgrade -y
```

-   `pkg update`: This command refreshes the list of available packages from the Termux repositories.
-   `pkg upgrade -y`: This command upgrades all installed packages to their newest versions. The `-y` flag automatically confirms any prompts, allowing the upgrade to proceed without manual intervention.

### 2.3 Install Git

Git is the version control system that allows you to interact with GitHub. Install it using the Termux package manager:

```bash
pkg install git -y
```

### 2.4 Configure Git

After installing Git, you need to configure your user name and email address. These details are crucial because they will be embedded in every commit you make to your GitHub repository, identifying you as the author of the changes. Use the exact username and email associated with your GitHub account.

```bash
git config --global user.name "Your GitHub Username"
git config --global user.email "your_github_email@example.com"
```

-   Replace `"Your GitHub Username"` with your actual GitHub username (e.g., `"johndoe"`).
-   Replace `"your_github_email@example.com"` with the email address you used to sign up for GitHub (e.g., `"john.doe@example.com"`).

### 2.5 Set Up SSH (Recommended for Secure and Convenient GitHub Access)

While you can use HTTPS for Git operations (which often requires entering a Personal Access Token for every push), setting up SSH provides a more secure and convenient way to authenticate with GitHub, especially for frequent pushes. Once set up, you won't need to enter credentials repeatedly.

1.  **Generate an SSH key pair**: If you don't already have an SSH key pair on your Termux environment, generate a new one. The `ed25519` algorithm is recommended for its security and performance [4].

    ```bash
    ssh-keygen -t ed25519 -C "your_github_email@example.com"
    ```

    -   When prompted for a file in which to save the key, press `Enter` to accept the default location (`/data/data/com.termux/files/home/.ssh/id_ed25519`).
    -   You will then be asked for a passphrase. You can set a strong passphrase for added security (you'll need to enter it each time you use the key), or you can leave it empty by pressing `Enter` twice if you prefer convenience over maximum security for this setup.

2.  **Start the SSH agent**: The SSH agent is a program that holds your private keys in memory, so you don't have to enter your passphrase every time you use your SSH key.

    ```bash
    eval $(ssh-agent -s)
    ```

3.  **Add your SSH key to the agent**: If you set a passphrase, you'll be prompted to enter it here.

    ```bash
    ssh-add ~/.ssh/id_ed25519
    ```

4.  **Copy your public SSH key**: You need to add this public key to your GitHub account so GitHub recognizes your Termux environment as an authorized device.

    ```bash
    cat ~/.ssh/id_ed25519.pub
    ```

    -   Copy the entire output displayed in your Termux terminal. It will start with `ssh-ed25519` and end with your email address.

5.  **Add SSH key to GitHub**: 
    -   Open your web browser (on your Android device or a computer) and go to [GitHub.com](https://github.com).
    -   Click on your **profile picture** in the top-right corner, then select **"Settings."**
    -   In the left sidebar, click on **"SSH and GPG keys."**
    -   Click the green **"New SSH key"** button [5].
    -   In the "Title" field, give your key a descriptive name (e.g., "Termux Android Phone").
    -   Paste the entire public key you copied from Termux into the "Key" field.
    -   Click **"Add SSH key."** You might be prompted to confirm your GitHub password.

6.  **Test SSH connection**: Go back to your Termux terminal and test if your SSH setup is working correctly with GitHub.

    ```bash
    ssh -T git@github.com
    ```

    -   The first time you connect, you might see a warning about the host's authenticity. Type `yes` and press `Enter` to continue.
    -   A successful connection will display a message similar to: `Hi your_github_username! You've successfully authenticated, but GitHub does not provide shell access.` This confirms that your SSH key is correctly set up and recognized by GitHub.

### 2.6 Grant Termux Storage Access

For Termux to easily access your website files stored on your Android device's internal storage, you need to grant it storage permissions. This command will prompt you to do so.

```bash
termux-setup-storage
```

-   When prompted, grant the necessary permissions. This command creates a `storage` folder in your Termux home directory (`~/storage/`). Inside this folder, you'll find symlinks to various parts of your device's storage, such as `~/storage/shared` (for your device's internal shared storage, often where your Downloads folder is located), `~/storage/downloads`, `~/storage/dcim`, etc. This makes it easy to navigate to your project files from within Termux.

## Phase 3: Explain Project Transfer and Initial Push to GitHub

Now that Termux and Git are configured, let's get your "Comfort & Pondlike" website files into your Termux environment and push them to your newly created GitHub repository.

### 3.1 Transfer Your Website Files to Termux Environment

There are two primary ways to get your website files into Termux:

#### Option A: Copy Files Manually (Recommended for initial setup)

This method is straightforward if your `comfort-pondlike` project files are already on your Android device.

1.  **Locate your project files**: Using your Android device's file manager (e.g., Google Files, My Files), find the `comfort-pondlike` folder that contains your `index.html`, `css/`, `js/`, `images/`, etc.
2.  **Copy the `comfort-pondlike` folder**: Copy this entire folder.
3.  **Paste into Termux-accessible location**: Paste the `comfort-pondlike` folder into a location that Termux can easily access. The `~/storage/shared` directory (which links to your device's internal storage) is a good choice. For example, you can paste it directly into your `Downloads` folder, which is accessible via `~/storage/downloads` in Termux.

    *Example Path on Android*: `/storage/emulated/0/Download/comfort-pondlike`
    *Corresponding Path in Termux*: `~/storage/downloads/comfort-pondlike`

4.  **Navigate to the copied folder in Termux**:

    ```bash
    cd ~/storage/downloads/comfort-pondlike
    # Or if you copied it elsewhere, adjust the path accordingly
    ```

#### Option B: Clone from an Existing GitHub Repository (If already on GitHub)

If, for some reason, your `comfort-pondlike` project is already in another GitHub repository (not the one you just created for GitHub Pages), you could clone it. However, for this guide, we assume you're starting fresh with a new GitHub repository for GitHub Pages.

### 3.2 Initialize Git in Your Project Folder and Push to GitHub

Now that your website files are in your Termux environment, you need to initialize a Git repository within that folder and push its contents to the GitHub repository you created in Phase 1.

1.  **Ensure you are in your project directory**: Double-check that your Termux terminal is currently inside the `comfort-pondlike` folder.

    ```bash
    pwd
    # Expected output: /data/data/com.termux/files/home/storage/downloads/comfort-pondlike
    # Or similar path where you copied your project
    ```

2.  **Initialize a new Git repository**: This command creates a hidden `.git` directory, turning your project folder into a Git repository.

    ```bash
    git init
    ```

3.  **Add all project files to the staging area**: This command tells Git to start tracking all the files in your current directory.

    ```bash
    git add .
    ```

4.  **Commit your changes**: This saves your staged files to your local Git repository with a descriptive message.

    ```bash
    git commit -m "Initial commit: Comfort & Pondlike website files"
    ```

5.  **Connect your local repository to your GitHub repository**: You need to tell your local Git repository where its remote counterpart is on GitHub. Replace `yourusername` and `comfort-pondlike` with your actual GitHub username and the repository name you chose.

    ```bash
    git remote add origin git@github.com:yourusername/comfort-pondlike.git
    # If you did not set up SSH, you can use HTTPS with a Personal Access Token:
    # git remote add origin https://github.com/yourusername/comfort-pondlike.git
    ```

6.  **Rename your default branch to `main` (if necessary)**: GitHub's default branch name is now `main`. If your local Git initialized with `master`, it's good practice to rename it.

    ```bash
    git branch -M main
    ```

7.  **Push your code to GitHub**: This command uploads all your committed files from your Termux environment to your GitHub repository.

    ```bash
    git push -u origin main
    ```

    -   If you are using SSH, it will use your SSH key for authentication.
    -   If you are using HTTPS, you will be prompted for your GitHub username and then your Personal Access Token (PAT). You must use a PAT, as GitHub no longer supports password authentication for Git operations over HTTPS [6].

    After a successful push, all your website files will be visible in your GitHub repository online.

## Phase 4: Detail GitHub Pages Configuration and Verification

With your website files now on GitHub, the next step is to configure GitHub Pages to serve them as a live website. This is done through your repository's settings on the GitHub website.

### 4.1 Configure GitHub Pages Settings

1.  **Open your web browser** (on your Android device or a computer) and navigate to your GitHub repository (e.g., `https://github.com/yourusername/comfort-pondlike`).
2.  Click on the **"Settings" tab** in your repository's navigation bar (usually near the top right, next to "Code," "Issues," etc.).
3.  In the left sidebar, click on **"Pages"** [3].

    <img src="https://docs.github.com/assets/images/help/pages/pages-sidebar.png" alt="GitHub Pages sidebar link" width="300"/>

4.  Under the "Build and deployment" section, for "Source," select **"Deploy from a branch."**
5.  For "Branch," select `main` (or `master` if that's your primary branch) from the dropdown menu. For the folder, select **`/ (root)`**.
6.  Click the **"Save"** button.

    <img src="https://docs.github.com/assets/images/help/pages/publishing-source-branch.png" alt="GitHub Pages publishing source branch settings" width="600"/>

### 4.2 Wait for Deployment and Verify

-   After saving the settings, GitHub Pages will automatically start the deployment process. This usually takes a few minutes.
-   You can monitor the deployment status directly on the "Pages" settings page. A green checkmark next to the branch indicates a successful deployment.
-   Once deployed, GitHub will provide you with the URL where your site is live. For a project site named `comfort-pondlike`, the URL will typically be `https://yourusername.github.io/comfort-pondlike/`.

### 4.3 Access Your Live Site

-   Open your web browser and navigate to the URL provided by GitHub Pages (e.g., `https://yourusername.github.io/comfort-pondlike/`).
-   Verify that your "Comfort & Pondlike" website loads correctly and appears as a rendered webpage, not a list of files.

### 4.4 Troubleshooting: Why it Might Still Look Like a List of Files

If your site still appears as a list of files, here are the most common reasons and solutions:

1.  **Incorrect Branch/Folder Selection**: Double-check that in the GitHub Pages settings, you selected the correct branch (`main`) and the `/ (root)` folder. If your `index.html` is inside a subfolder (e.g., `public/index.html`), you would need to select that subfolder instead of `/ (root)`.
2.  **`index.html` Not in Root**: Ensure your main HTML file is actually named `index.html` and is located directly in the root of the branch you selected for GitHub Pages. GitHub Pages looks for `index.html` by default.
3.  **Case Sensitivity**: GitHub Pages is case-sensitive. Make sure your file names and paths (e.g., `index.html`, `css/styles.css`) match exactly in terms of capitalization.
4.  **Deployment Delay**: Sometimes it takes a few minutes for the changes to propagate. Wait a bit longer and try refreshing the page.
5.  **Browser Cache**: Clear your browser's cache or try opening the URL in an incognito/private browsing window.

### 4.5 Important Consideration for Project Sites (Base URL)

If you are deploying a **project site** (e.g., `https://yourusername.github.io/comfort-pondlike/`), your website's internal links and asset paths (CSS, JavaScript, images) might not load correctly because they are often written relative to the root of the domain (`/`). Since your project is in a sub-path (`/comfort-pondlike/`), these paths need adjustment.

**Solution**: Adjust your asset paths in `index.html`.

#### Option A: Prepend Repository Name to Paths

Modify your `index.html` to include your repository name in the paths. This is less ideal for maintenance but works.

```html
<!-- Before -->
<link rel="stylesheet" href="css/styles.css">
<script src="js/main.js"></script>
<img src="images/hero1.jpg" alt="Hero Image">

<!-- After (assuming your repository is 'comfort-pondlike') -->
<link rel="stylesheet" href="/comfort-pondlike/css/styles.css">
<script src="/comfort-pondlike/js/main.js"></script>
<img src="/comfort-pondlike/images/hero1.jpg" alt="Hero Image">
```

#### Option B: Use `<base>` Tag (Recommended for cleaner code)

Add a `<base>` tag in the `<head>` section of your `index.html`. This is the most common and recommended solution as it keeps your asset paths clean in your code.

```html
<head>
    <base href="/comfort-pondlike/"> <!-- Replace 'comfort-pondlike' with your actual repository name -->
    <link rel="stylesheet" href="css/styles.css">
    <script src="js/main.js"></script>
    <!-- Other head elements -->
</head>
```

-   This tag tells the browser that all relative URLs in your HTML should be resolved against this base URL. Remember to include the trailing slash in the `href` attribute.

## Phase 5: Address GitHub Pages Limitations and Provide Solutions

It is crucial to understand the inherent limitations of GitHub Pages, especially when dealing with projects that include server-side functionalities like the "Comfort & Pondlike" admin panel and the Dialogflow chatbot integration.

### 5.1 Understanding GitHub Pages as a Static Site Host

GitHub Pages is fundamentally designed to host **static websites**. A static website is composed of pre-built files (HTML, CSS, JavaScript, images, fonts, etc.) that are delivered to the user's browser exactly as they are stored on the server. There is no server-side processing involved when a user requests a page.

#### Key Characteristics of Static Sites:
-   **Speed**: Static sites are generally very fast because there's no server-side computation or database queries needed for each request.
-   **Security**: With no server-side logic or databases, the attack surface is significantly reduced, making them inherently more secure against many common web vulnerabilities.
-   **Scalability**: They can handle high traffic loads easily, often served directly from Content Delivery Networks (CDNs).
-   **Cost-Effective**: Many static site hosts (like GitHub Pages) offer free hosting.

#### What GitHub Pages **Cannot** Do:
-   **Run Server-Side Code**: This is the most important limitation. GitHub Pages cannot execute languages like Node.js (which your admin panel uses), Python (for your SEO scripts), PHP, Ruby, Java, etc. It does not have a server environment (like Apache, Nginx, or a Node.js runtime) to process these languages.
-   **Connect to Databases**: Since there's no server-side environment, you cannot directly connect to databases (e.g., MySQL, PostgreSQL, MongoDB) from a GitHub Pages site.
-   **Handle User Authentication (Server-Side)**: While your frontend can have a login form, the actual authentication process (verifying username/password against a database, issuing tokens) must happen on a separate server.
-   **Process Form Submissions (Server-Side)**: Forms on a static site can only send data to external services (like Formspree, Netlify Forms, or your own backend API).
-   **Perform Dynamic Content Generation (Server-Side)**: Content that changes frequently or is personalized for each user (e.g., a blog with comments, an e-commerce cart) cannot be generated on the fly by GitHub Pages itself.

### 5.2 Implications for Comfort & Pondlike Project

Given the nature of GitHub Pages, the following components of your "Comfort & Pondlike" project will **not be functional** when deployed solely to GitHub Pages:

1.  **Node.js Admin Panel (`admin/server.js`)**: This is a full-fledged Node.js application that uses Express.js, handles user authentication, manages social media icons, and processes slider content uploads. It requires a Node.js runtime environment to operate. On GitHub Pages, this file will simply be treated as a static text file and will not execute.
2.  **Dialogflow Chatbot Integration (Backend Part)**: While the frontend JavaScript for the chatbot (`js/main.js`) can initiate requests, the secure interaction with Dialogflow (especially if it involves sensitive API keys or service account credentials) typically requires a backend proxy. Directly embedding Google Cloud credentials in client-side JavaScript on a public static site is a significant security risk, as anyone can view your source code and steal your keys. Therefore, the Dialogflow integration, as designed for secure backend interaction, will not work directly on GitHub Pages without a separate backend.
3.  **Python SEO Scripts (`seo-generator.py`)**: These are Python scripts designed to run in a Python environment to generate content. They are not web-facing applications and cannot be executed by GitHub Pages.
4.  **WordPress Shortcode (`wordpress-shortcode.php`)**: This is PHP code designed to run within a WordPress environment. GitHub Pages does not support PHP, so this file will not function.

### 5.3 Alternatives for Server-Side Components

If you need the full functionality of your "Comfort & Pondlike" project, including the admin panel and a secure Dialogflow chatbot, you will need to deploy the server-side components to a platform that supports backend code execution. Here are some common alternatives:

#### 5.3.1 Vercel (Recommended for this project)
-   **Why**: Vercel is an excellent choice because it supports both static site hosting (for your frontend) and serverless functions (for your Node.js backend). It handles the complexities of deployment, scaling, and SSL certificates automatically.
-   **How**: As detailed in the `DEPLOYMENT_GUIDE.md` previously provided, Vercel allows you to define `builds` and `routes` in a `vercel.json` file to serve your static `index.html` and run your `admin/server.js` as a serverless function.
-   **Chatbot**: Vercel serverless functions can also act as the secure proxy for your Dialogflow integration, keeping your API keys safe.

#### 5.3.2 Heroku
-   **Why**: Heroku is a Platform as a Service (PaaS) that supports various programming languages, including Node.js. It's easy to deploy web applications.
-   **How**: You would configure your `admin/server.js` to be a web process, and Heroku would provide a public URL for it. Your static frontend could still be hosted on GitHub Pages, and you would configure your frontend JavaScript to make API calls to your Heroku backend.

#### 5.3.3 Render
-   **Why**: Similar to Heroku, Render is a unified cloud platform that offers services for web apps, APIs, databases, and static sites. It's known for its ease of use and good performance.
-   **How**: You can deploy your Node.js backend as a web service. Your static frontend can be hosted on GitHub Pages or directly on Render.

#### 5.3.4 Traditional VPS (Virtual Private Server)
-   **Why**: For maximum control and flexibility, you can rent a Virtual Private Server (e.g., from DigitalOcean, Linode, AWS EC2, Google Cloud Compute Engine).
-   **How**: You would manually set up a Linux server, install Node.js, configure a web server (like Nginx or Apache) to serve your static files and proxy requests to your Node.js application. This option requires more technical expertise.

### 5.4 Summary of Deployment Strategy

-   **For the static website (HTML, CSS, JS, images)**: GitHub Pages is an excellent, free, and easy-to-use option for hosting. All the visual and interactive elements that run purely on the client-side (like the hero slider, logo animation, responsive design) will work perfectly.
-   **For the admin panel and secure chatbot integration**: You will need a separate backend hosting solution that supports Node.js. Vercel is highly recommended due to its seamless integration with static sites and serverless functions, allowing you to deploy both frontend and backend components of this project within a single platform.

Therefore, while you can deploy the visual part of your "Comfort & Pondlike" website to GitHub Pages using Termux, the full functionality (especially the admin panel and secure chatbot) will require a more robust hosting environment for its backend components.

## Phase 6: Deliver the Comprehensive Guide to the User

This guide has provided you with the necessary steps to:

1.  Set up Termux on your Android device and install Git.
2.  Configure Git for use with GitHub, including SSH for secure access.
3.  Transfer your "Comfort & Pondlike" project into Termux.
4.  Deploy your static website to GitHub Pages directly from your Android device.
5.  Understand the limitations of GitHub Pages, particularly concerning server-side functionalities.
6.  Explore alternative hosting solutions for your backend components (admin panel, secure chatbot integration).

By following these instructions, you can effectively manage and deploy your web projects on the go using your Android device and Termux. Remember to choose the appropriate hosting solution for each part of your project based on its requirements.

---

**Author**: Manus AI
**Date**: July 26, 2025

## References

-   [1] GitHub Docs: Creating a new repository: [https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)
-   [2] F-Droid Termux Package: [https://f-droid.org/packages/com.termux/](https://f-droid.org/packages/com.termux/)
-   [3] GitHub Docs: Configuring a publishing source for GitHub Pages: [https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
-   [4] GitHub Docs: Generating a new SSH key and adding it to the ssh-agent: [https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
-   [5] GitHub Docs: Adding a new SSH key to your GitHub account: [https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)
-   [6] GitHub Docs: Managing your personal access tokens: [https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)


