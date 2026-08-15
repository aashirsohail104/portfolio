---
id: 1
title: Battery charger catalog specification
stage: spec
date: 2026-08-09
surface: agent
model: deepseek-v4-flash-free
feature: 001-battery-charger-catalog
branch: 001-battery-charger-catalog
user: Haroon Traders
command: /sp.specify
labels: ["spec", "catalog", "ecommerce", "data-layer", "21st-mcp"]
links:
  spec: specs/001-battery-charger-catalog/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-battery-charger-catalog/spec.md
  - specs/001-battery-charger-catalog/checklists/requirements.md
tests:
  - None (spec stage, no runtime code)
---

## Prompt

## Product Data, Images & Content Source (MANDATORY)

Primary Product Source:
https://smarteshop.pk/collections/battery-chargers

This website is the OFFICIAL data source for this project.

I have explicit permission from the website owner to use the product information and product images.

Use this website as the primary source for:

• Product Images
• Product Names
• Product Descriptions
• Product Specifications
• Technical Features
• Product Categories
• Product Variants
• Product Pricing
• Discounts
• Product Ratings (if available)
• Warranty Information
• Brand Information
• Delivery Information
• Stock Status
• Product Attributes
• Product Tags
• Related Products

The AI MUST research the complete Battery Charger collection first before implementation.

Then create a structured product database that includes:

{
  id,
  slug,
  category,
  subCategory,
  brand,
  productName,
  shortDescription,
  fullDescription,
  specifications,
  features,
  voltage,
  chargingCurrent,
  batteryCompatibility,
  warranty,
  stockStatus,
  price,
  oldPrice,
  discount,
  rating,
  reviews,
  image,
  galleryImages,
  tags,
  relatedProducts
}

### Product Images

Use the product images directly from the reference website for all demo products.

Every product card, quick view, product detail page, featured products, best sellers, flash sale, related products, wishlist, compare page, search results, and shopping cart should display the corresponding product image from the reference website.

Maintain the original image quality.

Implement:

• Responsive Images
• Lazy Loading
• Image Optimization
• Image Skeleton Loading
• Image Zoom
• Image Gallery
• Thumbnail Navigation
• Hover Preview
• Progressive Loading

### Data Accuracy

The generated catalog should closely match the reference website's latest battery charger collection, including product hierarchy and specifications, while presenting them in a completely new, premium UI/UX.

### Future Scalability

Store all product data inside a reusable JSON data layer so products can be updated simply by replacing the JSON or connecting to an API later without modifying the UI components.

## Response snapshot

Researched the full smarteshop.pk battery charger collection (23 products over
2 pages) and wrote the feature spec for branch 001-battery-charger-catalog.
Spec defines 5 prioritized user stories (browse catalog, product details,
search/discovery, cart & wishlist, compare), 18 functional requirements, key
entities (Product, Category, Variant, CartItem, WishlistItem, RelatedProduct),
7 measurable success criteria (incl. constitution Lighthouse/WCAG budget and
21st.dev MCP component mandate), edge cases (sold-out, variants/From pricing,
no-discount items, broken images, empty results), and an Assumptions section
(hotlinked source CDN images, PKR currency, no fabricated ratings, demo-scope
storefront, client-side persistence, research-time data accuracy). Spec passed
quality checklist (all items). No [NEEDS CLARIFICATION] markers required;
ready for /sp.plan.

## Outcome

- ✅ Impact: Specifies a reusable JSON product-data layer decoupled from UI,
  full battery-charger demo storefront, and mandatory 21st.dev MCP component
  sourcing per the ratified constitution.
- 🧪 Tests: None (spec stage, no runtime code)
- 📁 Files: specs/001-battery-charger-catalog/spec.md,
  specs/001-battery-charger-catalog/checklists/requirements.md
- 🔁 Next prompts: /sp.plan to design data layer + component inventory.
- 🧠 Reflection: Source collection researched fully (23 products, variants,
  sold-out states) to ground the spec in real data; assumptions documented
  rather than blocking on clarifications.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Spec quality checklist PASS (all 16
  items); no unresolved clarification markers.
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
