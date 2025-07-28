#!/usr/bin/env python3
"""
SEO Content Generator for Comfort & Pondlike
Automatically generates SEO-friendly product titles, descriptions, and schema markup
"""

import json
import re
from datetime import datetime
from typing import Dict, List, Optional
import random

class SEOContentGenerator:
    def __init__(self):
        self.keywords = [
            "organic", "natural", "premium", "wellness", "health", "supplement",
            "herbal", "plant-based", "holistic", "pure", "clean", "sustainable",
            "eco-friendly", "vegan", "non-GMO", "gluten-free", "laboratory-tested",
            "clinically-proven", "high-potency", "bioavailable", "therapeutic-grade"
        ]
        
        self.health_benefits = [
            "immune support", "energy boost", "stress relief", "digestive health",
            "heart health", "brain function", "joint support", "antioxidant protection",
            "metabolism support", "sleep quality", "mood enhancement", "skin health",
            "anti-inflammatory", "detoxification", "cellular health", "hormonal balance"
        ]
        
        self.product_categories = {
            "supplements": ["capsules", "tablets", "powder", "liquid", "gummies"],
            "herbs": ["extract", "tincture", "tea", "dried", "fresh"],
            "vitamins": ["complex", "individual", "multivitamin", "mineral"],
            "protein": ["powder", "bars", "shakes", "isolate", "blend"],
            "superfoods": ["powder", "capsules", "raw", "organic", "blend"]
        }

    def generate_product_title(self, base_name: str, category: str = "supplements") -> str:
        """Generate SEO-optimized product title"""
        keywords = random.sample(self.keywords, 2)
        benefit = random.choice(self.health_benefits)
        form = random.choice(self.product_categories.get(category, ["supplement"]))
        
        # Create variations of title structure
        structures = [
            f"{keywords[0].title()} {base_name} {form.title()} - {benefit.title()}",
            f"{base_name} {keywords[0].title()} {form.title()} for {benefit.title()}",
            f"{keywords[0].title()} {keywords[1].title()} {base_name} - {benefit.title()} {form.title()}",
            f"Premium {base_name} {form.title()} - {keywords[0].title()} {benefit.title()} Support"
        ]
        
        return random.choice(structures)

    def generate_product_description(self, product_name: str, benefits: List[str] = None) -> str:
        """Generate comprehensive SEO product description"""
        if not benefits:
            benefits = random.sample(self.health_benefits, 3)
        
        keywords = random.sample(self.keywords, 3)
        
        description = f"""
Discover the power of {product_name}, a {keywords[0]} and {keywords[1]} wellness solution designed to support your health journey. Our {keywords[2]} formula combines traditional wisdom with modern science to deliver exceptional results.

**Key Benefits:**
• Enhanced {benefits[0]} for optimal wellness
• Supports {benefits[1]} naturally
• Promotes {benefits[2]} and overall vitality

**Why Choose Our {product_name}:**
Our commitment to quality means every batch is laboratory-tested for purity and potency. We source only the finest ingredients, ensuring you receive a premium product that meets the highest standards of excellence.

**Quality Assurance:**
✓ Third-party tested for purity
✓ Non-GMO and gluten-free
✓ Manufactured in FDA-registered facilities
✓ Sustainable and eco-friendly packaging

Experience the difference that quality makes. Join thousands of satisfied customers who trust Comfort & Pondlike for their wellness needs.

*These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.*
        """.strip()
        
        return description

    def generate_meta_description(self, product_name: str, main_benefit: str) -> str:
        """Generate SEO meta description (150-160 characters)"""
        keyword = random.choice(self.keywords)
        
        descriptions = [
            f"Shop {keyword} {product_name} for {main_benefit}. Premium quality, lab-tested supplements. Free shipping on orders over $50.",
            f"Discover {keyword} {product_name} - natural {main_benefit} support. High-quality wellness products at Comfort & Pondlike.",
            f"Premium {product_name} supplements for {main_benefit}. {keyword.title()}, pure, and effective. Order now with fast delivery."
        ]
        
        # Ensure meta description is within optimal length
        meta_desc = random.choice(descriptions)
        if len(meta_desc) > 160:
            meta_desc = meta_desc[:157] + "..."
        
        return meta_desc

    def generate_schema_markup(self, product_data: Dict) -> Dict:
        """Generate JSON-LD schema markup for products"""
        schema = {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product_data.get("name", ""),
            "description": product_data.get("description", ""),
            "brand": {
                "@type": "Brand",
                "name": "Comfort & Pondlike"
            },
            "manufacturer": {
                "@type": "Organization",
                "name": "Comfort & Pondlike"
            },
            "category": product_data.get("category", "Health Supplements"),
            "offers": {
                "@type": "Offer",
                "price": product_data.get("price", "0.00"),
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "seller": {
                    "@type": "Organization",
                    "name": "Comfort & Pondlike"
                }
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": product_data.get("rating", "4.5"),
                "reviewCount": product_data.get("review_count", "127")
            },
            "review": [
                {
                    "@type": "Review",
                    "reviewRating": {
                        "@type": "Rating",
                        "ratingValue": "5"
                    },
                    "author": {
                        "@type": "Person",
                        "name": "Sarah Johnson"
                    },
                    "reviewBody": "Amazing product! Really helped with my wellness goals."
                }
            ]
        }
        
        return schema

    def generate_blog_post_title(self, topic: str) -> str:
        """Generate SEO-optimized blog post titles"""
        current_year = datetime.now().year
        
        title_templates = [
            f"The Ultimate Guide to {topic} in {current_year}",
            f"10 Science-Backed Benefits of {topic}",
            f"How to Choose the Best {topic} for Your Needs",
            f"{topic}: Everything You Need to Know",
            f"Natural {topic} Solutions That Actually Work",
            f"The Complete {topic} Buyer's Guide {current_year}",
            f"Expert Tips for Maximizing {topic} Benefits",
            f"{topic} vs Alternatives: Which is Better?"
        ]
        
        return random.choice(title_templates)

    def generate_url_slug(self, title: str) -> str:
        """Generate SEO-friendly URL slug"""
        # Convert to lowercase and replace spaces with hyphens
        slug = title.lower()
        # Remove special characters except hyphens
        slug = re.sub(r'[^a-z0-9\s-]', '', slug)
        # Replace spaces with hyphens
        slug = re.sub(r'\s+', '-', slug)
        # Remove multiple consecutive hyphens
        slug = re.sub(r'-+', '-', slug)
        # Remove leading/trailing hyphens
        slug = slug.strip('-')
        
        return slug

    def generate_alt_text(self, product_name: str, context: str = "") -> str:
        """Generate descriptive alt text for images"""
        keyword = random.choice(self.keywords)
        
        if context:
            return f"{keyword.title()} {product_name} {context} - Comfort & Pondlike wellness products"
        else:
            return f"{keyword.title()} {product_name} supplement bottle - premium health products"

    def generate_sitemap_entry(self, url: str, priority: float = 0.8, changefreq: str = "weekly") -> Dict:
        """Generate sitemap entry for SEO"""
        return {
            "loc": url,
            "lastmod": datetime.now().strftime("%Y-%m-%d"),
            "changefreq": changefreq,
            "priority": priority
        }

def main():
    """Example usage of the SEO Content Generator"""
    generator = SEOContentGenerator()
    
    # Example product data
    products = [
        {
            "base_name": "Ashwagandha",
            "category": "herbs",
            "price": "29.99",
            "benefits": ["stress relief", "energy boost", "mood enhancement"]
        },
        {
            "base_name": "Omega-3",
            "category": "supplements",
            "price": "39.99",
            "benefits": ["heart health", "brain function", "anti-inflammatory"]
        },
        {
            "base_name": "Turmeric Curcumin",
            "category": "herbs",
            "price": "24.99",
            "benefits": ["anti-inflammatory", "joint support", "antioxidant protection"]
        },
        {
            "base_name": "Protein Blend",
            "category": "protein",
            "price": "49.99",
            "benefits": ["muscle support", "energy boost", "metabolism support"]
        },
        {
            "base_name": "Spirulina",
            "category": "superfoods",
            "price": "34.99",
            "benefits": ["immune support", "detoxification", "cellular health"]
        }
    ]
    
    print("=== SEO Content Generation Examples ===\n")
    
    for product in products:
        print(f"Product: {product['base_name']}")
        print("-" * 50)
        
        # Generate title
        title = generator.generate_product_title(product['base_name'], product['category'])
        print(f"Title: {title}")
        
        # Generate meta description
        main_benefit = product['benefits'][0]
        meta_desc = generator.generate_meta_description(product['base_name'], main_benefit)
        print(f"Meta Description: {meta_desc}")
        
        # Generate URL slug
        slug = generator.generate_url_slug(title)
        print(f"URL Slug: {slug}")
        
        # Generate alt text
        alt_text = generator.generate_alt_text(product['base_name'])
        print(f"Alt Text: {alt_text}")
        
        # Generate schema markup
        product_data = {
            "name": title,
            "description": generator.generate_product_description(product['base_name'], product['benefits']),
            "price": product['price'],
            "category": product['category'].title()
        }
        schema = generator.generate_schema_markup(product_data)
        
        print(f"Schema Markup: {json.dumps(schema, indent=2)[:200]}...")
        print("\n" + "="*70 + "\n")
    
    # Generate blog post examples
    print("=== Blog Post Title Examples ===\n")
    blog_topics = ["Natural Supplements", "Wellness Routines", "Immune Support", "Stress Management"]
    
    for topic in blog_topics:
        title = generator.generate_blog_post_title(topic)
        slug = generator.generate_url_slug(title)
        print(f"Topic: {topic}")
        print(f"Title: {title}")
        print(f"Slug: {slug}")
        print()

if __name__ == "__main__":
    main()

