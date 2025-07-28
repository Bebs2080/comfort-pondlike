<?php
/**
 * Comfort & Pondlike Hero Slider WordPress Shortcode
 * Integrates with WooCommerce product data
 * 
 * Usage: [comfort_pondlike_slider category="supplements" limit="5"]
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class ComfortPondlikeSlider {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
    }
    
    public function init() {
        add_shortcode('comfort_pondlike_slider', array($this, 'render_slider'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
    }
    
    public function enqueue_scripts() {
        wp_enqueue_style(
            'comfort-pondlike-slider',
            plugin_dir_url(__FILE__) . 'assets/slider.css',
            array(),
            '1.0.0'
        );
        
        wp_enqueue_script(
            'comfort-pondlike-slider-js',
            plugin_dir_url(__FILE__) . 'assets/slider.js',
            array('jquery'),
            '1.0.0',
            true
        );
    }
    
    public function render_slider($atts) {
        // Parse shortcode attributes
        $atts = shortcode_atts(array(
            'category' => '',
            'limit' => 5,
            'autoplay' => 'true',
            'arrows' => 'true',
            'dots' => 'true',
            'speed' => 5000,
            'type' => 'hero' // hero, product, or featured
        ), $atts, 'comfort_pondlike_slider');
        
        // Start output buffering
        ob_start();
        
        // Get products based on type
        if ($atts['type'] === 'product' && class_exists('WooCommerce')) {
            echo $this->render_product_slider($atts);
        } else {
            echo $this->render_hero_slider($atts);
        }
        
        return ob_get_clean();
    }
    
    private function render_hero_slider($atts) {
        $slides = $this->get_hero_slides();
        
        if (empty($slides)) {
            return '<p>No slides found.</p>';
        }
        
        $slider_id = 'comfort-slider-' . uniqid();
        $autoplay = $atts['autoplay'] === 'true' ? 'true' : 'false';
        $speed = intval($atts['speed']);
        
        $html = '<div class="comfort-pondlike-slider" id="' . $slider_id . '" data-autoplay="' . $autoplay . '" data-speed="' . $speed . '">';
        $html .= '<div class="slider-container">';
        
        foreach ($slides as $index => $slide) {
            $active_class = $index === 0 ? ' active' : '';
            $html .= '<div class="slide' . $active_class . '" style="background-image: url(' . esc_url($slide['image']) . ');">';
            $html .= '<div class="slide-content">';
            $html .= '<h2 class="slide-title">' . esc_html($slide['title']) . '</h2>';
            $html .= '<p class="slide-description">' . esc_html($slide['description']) . '</p>';
            if (!empty($slide['button_text']) && !empty($slide['button_url'])) {
                $html .= '<a href="' . esc_url($slide['button_url']) . '" class="slide-button">' . esc_html($slide['button_text']) . '</a>';
            }
            $html .= '</div>';
            $html .= '</div>';
        }
        
        $html .= '</div>';
        
        // Add navigation arrows if enabled
        if ($atts['arrows'] === 'true') {
            $html .= '<button class="slider-nav prev" aria-label="Previous slide">';
            $html .= '<i class="fas fa-chevron-left"></i>';
            $html .= '</button>';
            $html .= '<button class="slider-nav next" aria-label="Next slide">';
            $html .= '<i class="fas fa-chevron-right"></i>';
            $html .= '</button>';
        }
        
        // Add dots navigation if enabled
        if ($atts['dots'] === 'true') {
            $html .= '<div class="slider-dots">';
            foreach ($slides as $index => $slide) {
                $active_class = $index === 0 ? ' active' : '';
                $html .= '<button class="dot' . $active_class . '" data-slide="' . $index . '" aria-label="Go to slide ' . ($index + 1) . '"></button>';
            }
            $html .= '</div>';
        }
        
        $html .= '</div>';
        
        return $html;
    }
    
    private function render_product_slider($atts) {
        $products = $this->get_woocommerce_products($atts);
        
        if (empty($products)) {
            return '<p>No products found.</p>';
        }
        
        $slider_id = 'comfort-product-slider-' . uniqid();
        
        $html = '<div class="comfort-pondlike-product-slider" id="' . $slider_id . '">';
        $html .= '<div class="products-slider">';
        $html .= '<div class="slider-wrapper">';
        
        foreach ($products as $product) {
            $html .= '<div class="product-slide">';
            $html .= '<a href="' . get_permalink($product->get_id()) . '">';
            $html .= '<img src="' . wp_get_attachment_image_url($product->get_image_id(), 'medium') . '" alt="' . esc_attr($product->get_name()) . '" loading="lazy">';
            $html .= '<h3>' . esc_html($product->get_name()) . '</h3>';
            $html .= '<p class="price">' . $product->get_price_html() . '</p>';
            $html .= '</a>';
            $html .= '</div>';
        }
        
        $html .= '</div>';
        $html .= '<button class="products-nav prev" aria-label="Previous products">';
        $html .= '<i class="fas fa-chevron-left"></i>';
        $html .= '</button>';
        $html .= '<button class="products-nav next" aria-label="Next products">';
        $html .= '<i class="fas fa-chevron-right"></i>';
        $html .= '</button>';
        $html .= '</div>';
        $html .= '</div>';
        
        return $html;
    }
    
    private function get_hero_slides() {
        // Get slides from WordPress options or custom post type
        $slides = get_option('comfort_pondlike_hero_slides', array());
        
        // Default slides if none configured
        if (empty($slides)) {
            $slides = array(
                array(
                    'title' => 'Welcome to Comfort & Pondlike',
                    'description' => 'Discover premium health and wellness products for a better lifestyle',
                    'image' => get_template_directory_uri() . '/assets/images/hero1.jpg',
                    'button_text' => 'Shop Now',
                    'button_url' => '/shop'
                ),
                array(
                    'title' => 'Natural Wellness Solutions',
                    'description' => 'Organic and natural products for your health journey',
                    'image' => get_template_directory_uri() . '/assets/images/hero2.jpg',
                    'button_text' => 'Explore Products',
                    'button_url' => '/products'
                ),
                array(
                    'title' => 'Transform Your Lifestyle',
                    'description' => 'Join thousands who trust Comfort & Pondlike for their wellness needs',
                    'image' => get_template_directory_uri() . '/assets/images/hero3.jpg',
                    'button_text' => 'Learn More',
                    'button_url' => '/about'
                )
            );
        }
        
        return $slides;
    }
    
    private function get_woocommerce_products($atts) {
        if (!class_exists('WooCommerce')) {
            return array();
        }
        
        $args = array(
            'post_type' => 'product',
            'post_status' => 'publish',
            'posts_per_page' => intval($atts['limit']),
            'meta_query' => array(
                array(
                    'key' => '_visibility',
                    'value' => array('catalog', 'visible'),
                    'compare' => 'IN'
                )
            )
        );
        
        // Add category filter if specified
        if (!empty($atts['category'])) {
            $args['tax_query'] = array(
                array(
                    'taxonomy' => 'product_cat',
                    'field' => 'slug',
                    'terms' => $atts['category']
                )
            );
        }
        
        $query = new WP_Query($args);
        $products = array();
        
        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $product = wc_get_product(get_the_ID());
                if ($product) {
                    $products[] = $product;
                }
            }
            wp_reset_postdata();
        }
        
        return $products;
    }
}

// Initialize the slider
new ComfortPondlikeSlider();

/**
 * Admin interface for managing slider content
 */
class ComfortPondlikeSliderAdmin {
    
    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'init_settings'));
    }
    
    public function add_admin_menu() {
        add_options_page(
            'Comfort & Pondlike Slider',
            'C&P Slider',
            'manage_options',
            'comfort-pondlike-slider',
            array($this, 'admin_page')
        );
    }
    
    public function init_settings() {
        register_setting('comfort_pondlike_slider', 'comfort_pondlike_hero_slides');
    }
    
    public function admin_page() {
        $slides = get_option('comfort_pondlike_hero_slides', array());
        ?>
        <div class="wrap">
            <h1>Comfort & Pondlike Slider Settings</h1>
            
            <h2>Shortcode Usage</h2>
            <p>Use the following shortcodes to display sliders:</p>
            <ul>
                <li><code>[comfort_pondlike_slider]</code> - Default hero slider</li>
                <li><code>[comfort_pondlike_slider type="product" category="supplements" limit="5"]</code> - Product slider</li>
                <li><code>[comfort_pondlike_slider autoplay="false" arrows="true" dots="true"]</code> - Custom settings</li>
            </ul>
            
            <h2>Slider Configuration</h2>
            <form method="post" action="options.php">
                <?php settings_fields('comfort_pondlike_slider'); ?>
                
                <table class="form-table">
                    <tr>
                        <th scope="row">Hero Slides</th>
                        <td>
                            <div id="slides-container">
                                <?php foreach ($slides as $index => $slide): ?>
                                    <div class="slide-item" data-index="<?php echo $index; ?>">
                                        <h4>Slide <?php echo $index + 1; ?></h4>
                                        <p>
                                            <label>Title:</label><br>
                                            <input type="text" name="comfort_pondlike_hero_slides[<?php echo $index; ?>][title]" value="<?php echo esc_attr($slide['title']); ?>" style="width: 100%;">
                                        </p>
                                        <p>
                                            <label>Description:</label><br>
                                            <textarea name="comfort_pondlike_hero_slides[<?php echo $index; ?>][description]" style="width: 100%; height: 60px;"><?php echo esc_textarea($slide['description']); ?></textarea>
                                        </p>
                                        <p>
                                            <label>Image URL:</label><br>
                                            <input type="url" name="comfort_pondlike_hero_slides[<?php echo $index; ?>][image]" value="<?php echo esc_url($slide['image']); ?>" style="width: 100%;">
                                        </p>
                                        <p>
                                            <label>Button Text:</label><br>
                                            <input type="text" name="comfort_pondlike_hero_slides[<?php echo $index; ?>][button_text]" value="<?php echo esc_attr($slide['button_text']); ?>" style="width: 100%;">
                                        </p>
                                        <p>
                                            <label>Button URL:</label><br>
                                            <input type="url" name="comfort_pondlike_hero_slides[<?php echo $index; ?>][button_url]" value="<?php echo esc_url($slide['button_url']); ?>" style="width: 100%;">
                                        </p>
                                        <button type="button" class="button remove-slide">Remove Slide</button>
                                        <hr>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                            
                            <button type="button" class="button" id="add-slide">Add New Slide</button>
                        </td>
                    </tr>
                </table>
                
                <?php submit_button(); ?>
            </form>
        </div>
        
        <script>
        jQuery(document).ready(function($) {
            let slideIndex = <?php echo count($slides); ?>;
            
            $('#add-slide').click(function() {
                const slideHtml = `
                    <div class="slide-item" data-index="${slideIndex}">
                        <h4>Slide ${slideIndex + 1}</h4>
                        <p>
                            <label>Title:</label><br>
                            <input type="text" name="comfort_pondlike_hero_slides[${slideIndex}][title]" value="" style="width: 100%;">
                        </p>
                        <p>
                            <label>Description:</label><br>
                            <textarea name="comfort_pondlike_hero_slides[${slideIndex}][description]" style="width: 100%; height: 60px;"></textarea>
                        </p>
                        <p>
                            <label>Image URL:</label><br>
                            <input type="url" name="comfort_pondlike_hero_slides[${slideIndex}][image]" value="" style="width: 100%;">
                        </p>
                        <p>
                            <label>Button Text:</label><br>
                            <input type="text" name="comfort_pondlike_hero_slides[${slideIndex}][button_text]" value="" style="width: 100%;">
                        </p>
                        <p>
                            <label>Button URL:</label><br>
                            <input type="url" name="comfort_pondlike_hero_slides[${slideIndex}][button_url]" value="" style="width: 100%;">
                        </p>
                        <button type="button" class="button remove-slide">Remove Slide</button>
                        <hr>
                    </div>
                `;
                
                $('#slides-container').append(slideHtml);
                slideIndex++;
            });
            
            $(document).on('click', '.remove-slide', function() {
                $(this).closest('.slide-item').remove();
            });
        });
        </script>
        <?php
    }
}

// Initialize admin interface
if (is_admin()) {
    new ComfortPondlikeSliderAdmin();
}

/**
 * CSS for the slider (save as assets/slider.css)
 */
function comfort_pondlike_slider_css() {
    return '
    .comfort-pondlike-slider {
        position: relative;
        height: 70vh;
        min-height: 500px;
        overflow: hidden;
        margin-bottom: 2rem;
    }
    
    .slider-container {
        position: relative;
        width: 100%;
        height: 100%;
    }
    
    .slide {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 1s ease-in-out;
    }
    
    .slide.active {
        opacity: 1;
    }
    
    .slide::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.4);
    }
    
    .slide-content {
        text-align: center;
        color: white;
        z-index: 2;
        max-width: 600px;
        padding: 0 20px;
    }
    
    .slide-title {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 20px;
    }
    
    .slide-description {
        font-size: 1.2rem;
        margin-bottom: 30px;
    }
    
    .slide-button {
        display: inline-block;
        padding: 15px 30px;
        background: #2c5530;
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        transition: background 0.3s ease;
    }
    
    .slide-button:hover {
        background: #4a7c59;
    }
    
    @media (max-width: 768px) {
        .comfort-pondlike-slider {
            height: 50vh;
            min-height: 400px;
        }
        
        .slide-title {
            font-size: 2rem;
        }
        
        .slide-description {
            font-size: 1rem;
        }
    }
    ';
}

/**
 * JavaScript for the slider (save as assets/slider.js)
 */
function comfort_pondlike_slider_js() {
    return '
    jQuery(document).ready(function($) {
        $(".comfort-pondlike-slider").each(function() {
            const slider = $(this);
            const slides = slider.find(".slide");
            const dots = slider.find(".dot");
            const prevBtn = slider.find(".slider-nav.prev");
            const nextBtn = slider.find(".slider-nav.next");
            
            let currentSlide = 0;
            let slideInterval;
            
            const autoplay = slider.data("autoplay") === true;
            const speed = slider.data("speed") || 5000;
            
            function updateSlide() {
                slides.removeClass("active").eq(currentSlide).addClass("active");
                dots.removeClass("active").eq(currentSlide).addClass("active");
            }
            
            function nextSlide() {
                currentSlide = (currentSlide + 1) % slides.length;
                updateSlide();
            }
            
            function prevSlide() {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                updateSlide();
            }
            
            function startAutoplay() {
                if (autoplay) {
                    slideInterval = setInterval(nextSlide, speed);
                }
            }
            
            function stopAutoplay() {
                if (slideInterval) {
                    clearInterval(slideInterval);
                }
            }
            
            // Event listeners
            nextBtn.click(function() {
                stopAutoplay();
                nextSlide();
                startAutoplay();
            });
            
            prevBtn.click(function() {
                stopAutoplay();
                prevSlide();
                startAutoplay();
            });
            
            dots.click(function() {
                stopAutoplay();
                currentSlide = $(this).data("slide");
                updateSlide();
                startAutoplay();
            });
            
            // Pause on hover
            slider.hover(stopAutoplay, startAutoplay);
            
            // Start autoplay
            startAutoplay();
        });
    });
    ';
}
?>

