const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'comfort-pondlike-secret-key';

// Middleware
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create subdirectories for different types of uploads
const subdirs = ['images', 'videos', 'hero'];
subdirs.forEach(dir => {
    const dirPath = path.join(uploadsDir, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadType = req.body.uploadType || 'images';
        const uploadPath = path.join(uploadsDir, uploadType);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        // Accept images and videos
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image and video files are allowed!'), false);
        }
    }
});

// In-memory storage for demo (in production, use a database)
let users = [
    {
        id: 1,
        username: 'admin',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        role: 'admin'
    }
];

let socialMediaIcons = [
    { id: 1, platform: 'facebook', url: 'https://facebook.com/comfortpondlike', enabled: true },
    { id: 2, platform: 'instagram', url: 'https://instagram.com/comfortpondlike', enabled: true },
    { id: 3, platform: 'linkedin', url: 'https://linkedin.com/company/comfortpondlike', enabled: true }
];

let sliderContent = [
    {
        id: 1,
        type: 'hero',
        title: 'Welcome to Comfort & Pondlike',
        description: 'Discover premium health and wellness products for a better lifestyle',
        image: '/images/hero1.jpg',
        order: 1,
        enabled: true
    },
    {
        id: 2,
        type: 'hero',
        title: 'Natural Wellness Solutions',
        description: 'Organic and natural products for your health journey',
        image: '/images/hero2.jpg',
        order: 2,
        enabled: true
    },
    {
        id: 3,
        type: 'hero',
        title: 'Transform Your Lifestyle',
        description: 'Join thousands who trust Comfort & Pondlike for their wellness needs',
        image: '/images/hero3.jpg',
        order: 3,
        enabled: true
    }
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Routes

// Authentication routes
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, username: user.username, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/logout', (req, res) => {
    res.json({ message: 'Logout successful' });
});

// Social media icons management
app.get('/api/social-icons', (req, res) => {
    res.json(socialMediaIcons);
});

app.get('/api/social-icons/admin', authenticateToken, (req, res) => {
    res.json(socialMediaIcons);
});

app.post('/api/social-icons', authenticateToken, (req, res) => {
    try {
        const { platform, url, enabled } = req.body;
        
        const newIcon = {
            id: Date.now(),
            platform,
            url,
            enabled: enabled !== undefined ? enabled : true
        };
        
        socialMediaIcons.push(newIcon);
        res.json({ message: 'Social media icon added successfully', icon: newIcon });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add social media icon' });
    }
});

app.put('/api/social-icons/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;
        const { platform, url, enabled } = req.body;
        
        const iconIndex = socialMediaIcons.findIndex(icon => icon.id == id);
        if (iconIndex === -1) {
            return res.status(404).json({ error: 'Social media icon not found' });
        }
        
        socialMediaIcons[iconIndex] = {
            ...socialMediaIcons[iconIndex],
            platform: platform || socialMediaIcons[iconIndex].platform,
            url: url || socialMediaIcons[iconIndex].url,
            enabled: enabled !== undefined ? enabled : socialMediaIcons[iconIndex].enabled
        };
        
        res.json({ message: 'Social media icon updated successfully', icon: socialMediaIcons[iconIndex] });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update social media icon' });
    }
});

app.delete('/api/social-icons/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;
        
        const iconIndex = socialMediaIcons.findIndex(icon => icon.id == id);
        if (iconIndex === -1) {
            return res.status(404).json({ error: 'Social media icon not found' });
        }
        
        socialMediaIcons.splice(iconIndex, 1);
        res.json({ message: 'Social media icon deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete social media icon' });
    }
});

// Slider content management
app.get('/api/slider-content', (req, res) => {
    const enabledContent = sliderContent.filter(item => item.enabled);
    res.json(enabledContent);
});

app.get('/api/slider-content/admin', authenticateToken, (req, res) => {
    res.json(sliderContent);
});

app.post('/api/slider-content', authenticateToken, upload.single('image'), (req, res) => {
    try {
        const { type, title, description, order, enabled } = req.body;
        
        const newContent = {
            id: Date.now(),
            type,
            title,
            description,
            image: req.file ? `/uploads/${req.body.uploadType || 'images'}/${req.file.filename}` : null,
            order: parseInt(order) || sliderContent.length + 1,
            enabled: enabled !== 'false'
        };
        
        sliderContent.push(newContent);
        sliderContent.sort((a, b) => a.order - b.order);
        
        res.json({ message: 'Slider content added successfully', content: newContent });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add slider content' });
    }
});

app.put('/api/slider-content/:id', authenticateToken, upload.single('image'), (req, res) => {
    try {
        const { id } = req.params;
        const { type, title, description, order, enabled } = req.body;
        
        const contentIndex = sliderContent.findIndex(item => item.id == id);
        if (contentIndex === -1) {
            return res.status(404).json({ error: 'Slider content not found' });
        }
        
        const updatedContent = {
            ...sliderContent[contentIndex],
            type: type || sliderContent[contentIndex].type,
            title: title || sliderContent[contentIndex].title,
            description: description || sliderContent[contentIndex].description,
            order: order ? parseInt(order) : sliderContent[contentIndex].order,
            enabled: enabled !== undefined ? enabled !== 'false' : sliderContent[contentIndex].enabled
        };
        
        if (req.file) {
            updatedContent.image = `/uploads/${req.body.uploadType || 'images'}/${req.file.filename}`;
        }
        
        sliderContent[contentIndex] = updatedContent;
        sliderContent.sort((a, b) => a.order - b.order);
        
        res.json({ message: 'Slider content updated successfully', content: updatedContent });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update slider content' });
    }
});

app.delete('/api/slider-content/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;
        
        const contentIndex = sliderContent.findIndex(item => item.id == id);
        if (contentIndex === -1) {
            return res.status(404).json({ error: 'Slider content not found' });
        }
        
        sliderContent.splice(contentIndex, 1);
        res.json({ message: 'Slider content deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete slider content' });
    }
});

// File upload endpoint
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const fileUrl = `/uploads/${req.body.uploadType || 'images'}/${req.file.filename}`;
        res.json({
            message: 'File uploaded successfully',
            filename: req.file.filename,
            url: fileUrl,
            size: req.file.size,
            mimetype: req.file.mimetype
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

// Dashboard stats
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
    const stats = {
        totalSlides: sliderContent.length,
        activeSlides: sliderContent.filter(item => item.enabled).length,
        socialIcons: socialMediaIcons.length,
        activeSocialIcons: socialMediaIcons.filter(icon => icon.enabled).length
    };
    
    res.json(stats);
});

// Serve admin panel HTML
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Default route
app.get('/', (req, res) => {
    res.json({
        message: 'Comfort & Pondlike Admin API',
        version: '1.0.0',
        endpoints: {
            login: 'POST /api/login',
            socialIcons: 'GET /api/social-icons',
            sliderContent: 'GET /api/slider-content',
            upload: 'POST /api/upload',
            admin: 'GET /admin'
        }
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
        }
    }
    
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Admin panel server running on http://0.0.0.0:${PORT}`);
    console.log(`Admin interface available at http://0.0.0.0:${PORT}/admin`);
});

module.exports = app;

