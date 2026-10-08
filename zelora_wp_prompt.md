Act as a senior WordPress theme developer and PHP developer.

I am developing a custom WordPress theme called "Zelora Infotech" for a corporate technology website. The theme is based on custom PHP templates, WordPress Customizer settings, local assets, Bootstrap Icons, custom CSS/JS, and editable homepage content.

TECH STACK
- WordPress 7.1.2
- Custom WordPress theme
- PHP
- WordPress Customizer API
- WP_Customize_Media_Control
- Bootstrap Icons
- Custom CSS/JavaScript
- Local development using Laragon/XAMPP
- Site URL currently:
  http://192.168.0.10/zelora_wp/

IMPORTANT DEVELOPMENT REQUIREMENTS

1. WORDPRESS CUSTOMIZER

The theme has a main Customizer panel:

"Zelora Homepage"

Sections:
- Navigation / URLs
- Hero
- Hero Service Bar
- About
- Services
- How We Work
- Industries
- Contact
- Footer
- Images

All homepage content must be editable from:
Appearance → Customize → Zelora Homepage

Text, URLs, images, logos, favicon, and contact information should be stored using WordPress theme mods.

Use the prefix:

zelora_

Existing helper functions include:

function zelora_asset($p = '')
{
    return trailingslashit(get_template_directory_uri()) . 'assets/' . ltrim($p, '/');
}

function zelora_mod($k, $default = '')
{
    $d = zelora_defaults();

    return get_theme_mod(
        'zelora_' . $k,
        array_key_exists($k, $d) ? $d[$k] : $default
    );
}

function zelora_url($k, $default = '#')
{
    $v = get_theme_mod('zelora_' . $k, '');

    return $v !== '' ? esc_url($v) : esc_url($default);
}


2. IMAGE CUSTOMIZER

The most important issue is that images uploaded through WordPress Customizer must actually replace the default theme images on the frontend.

Image settings should store WordPress attachment IDs.

Use:

'sanitize_callback' => 'absint'

and:

new WP_Customize_Media_Control(
    $c,
    'zelora_' . $k,
    array(
        'label'       => $label,
        'section'     => 'zelora_' . $section,
        'mime_type'   => 'image',
        'description' => 'Upload or select an image from the Media Library.',
    )
)

Do NOT rely only on WP_Customize_Image_Control if Media Control is more appropriate.

Use this image helper:

function zelora_image($k, $default = '')
{
    $value = get_theme_mod('zelora_' . $k, '');

    // Uploaded WordPress attachment ID
    if (is_numeric($value) && (int) $value > 0) {

        $url = wp_get_attachment_image_url(
            (int) $value,
            'full'
        );

        if ($url) {
            return esc_url($url);
        }
    }

    // If a URL was saved
    if (!empty($value) && filter_var($value, FILTER_VALIDATE_URL)) {
        return esc_url($value);
    }

    // Default theme image
    if (!empty($default)) {
        return esc_url(zelora_asset($default));
    }

    return '';
}

Frontend images must use:

<?php echo esc_url(zelora_image('hero_image', 'images/hero-dashboard.png')); ?>

NOT:

<?php echo esc_url(zelora_asset(zelora_mod('hero_image'))); ?>

because the Customizer image value is an attachment ID.

Current image fields:
- header_logo
- footer_logo
- hero_image
- about_image
- service1_image
- service2_image
- service3_image
- service4_image
- service5_image
- favicon


3. DEFAULT IMAGE VALUES

The default values should include:

'header_logo' => 'images/zelora-logo.png',
'footer_logo' => 'images/zelora-logo.png',
'hero_image' => 'images/hero-dashboard.png',
'about_image' => 'images/about.png',
'favicon' => 'images/favicon.png',

'service1_image' => 'images/erp-development.png',
'service2_image' => 'images/mobile-apps.png',
'service3_image' => 'images/ai-integration.png',
'service4_image' => 'images/business-growth.png',
'service5_image' => 'images/industry-automation.png'


4. FRONT-PAGE.PHP IMAGE IMPLEMENTATION

The frontend currently correctly uses:

Hero:

<img src="<?php echo esc_url(zelora_image('hero_image', 'images/hero-dashboard.png')); ?>"
     alt="Zelora analytics dashboard preview">

About:

<img src="<?php echo esc_url(zelora_image('about_image', 'images/about.png')); ?>"
     alt="Modern Zelora workplace">

Service 1:

<img src="<?php echo esc_url(zelora_image('service1_image', 'images/erp-development.png')); ?>">

Service 2:

<img src="<?php echo esc_url(zelora_image('service2_image', 'images/mobile-apps.png')); ?>">

Service 3:

<img src="<?php echo esc_url(zelora_image('service3_image', 'images/ai-integration.png')); ?>">

Service 4:

<img src="<?php echo esc_url(zelora_image('service4_image', 'images/business-growth.png')); ?>">

Service 5:

<img src="<?php echo esc_url(zelora_image('service5_image', 'images/industry-automation.png')); ?>">


5. LOGO

Header and footer logos must also use the Customizer-uploaded attachment ID.

Use:

<img src="<?php echo esc_url(zelora_image('header_logo', 'images/zelora-logo.png')); ?>"
     alt="<?php echo esc_attr(get_bloginfo('name')); ?>">

Footer:

<img src="<?php echo esc_url(zelora_image('footer_logo', 'images/zelora-logo.png')); ?>"
     alt="<?php echo esc_attr(get_bloginfo('name')); ?>">


6. FAVICON

Add favicon to the Customizer Images section.

Default:

'favicon' => 'images/favicon.png',

Add favicon output:

function zelora_favicon()
{
    $favicon_id = get_theme_mod('zelora_favicon', '');

    if ($favicon_id && is_numeric($favicon_id)) {

        $favicon_url = wp_get_attachment_image_url(
            (int) $favicon_id,
            'full'
        );

        if ($favicon_url) {
            echo '<link rel="icon" href="' . esc_url($favicon_url) . '">' . "\n";
            echo '<link rel="apple-touch-icon" href="' . esc_url($favicon_url) . '">' . "\n";
            return;
        }
    }

    $default_favicon = zelora_asset('images/favicon.png');

    echo '<link rel="icon" href="' . esc_url($default_favicon) . '">' . "\n";
}

add_action('wp_head', 'zelora_favicon', 1);

Favicon should be uploaded from:

Appearance → Customize → Zelora Homepage → Images → Favicon

Recommended favicon size: 512 × 512 PNG.


7. CONTACT SECTION

Add an editable office address field.

Default:

'office_address' => "1/198-3-3, Kurinji Malar St,\nMeenakshi Amman Nagar,\nLandmark - backside of Don Bosco School,\nSurya Nagar,\nMadurai, Tamil Nadu 625017",

Add to Contact Customizer:

'office_address' => 'Office Address',

Treat it as a textarea.

Frontend:

<div class="contact-line">
    <span class="contact-label">Office</span>
    <span class="contact-value">
        <?php echo nl2br(esc_html(zelora_mod('office_address'))); ?>
    </span>
</div>

The address should be editable from:

Appearance → Customize → Zelora Homepage → Contact → Office Address


8. CONTACT DEFAULTS

Use:

'email'          => 'info@zelorainfotech.com',
'phone'          => '+91 99945 131592',
'whatsapp_text'  => 'Message us on WhatsApp',
'whatsapp_url'   => '#',
'company'        => 'Zelora Infotech Private Limited',
'office_address' => "1/198-3-3, Kurinji Malar St,\nMeenakshi Amman Nagar,\nLandmark - backside of Don Bosco School,\nSurya Nagar,\nMadurai, Tamil Nadu 625017",
'footnote'       => 'Part of Renew Group of Companies. Enquiries are read by the delivery team, not a call centre.'


9. CUSTOMIZER IMAGE FIELDS

The final image field registration should be:

$image_fields = array(
    'header_logo' => 'Header logo',
    'footer_logo' => 'Footer logo',
    'hero_image'  => 'Hero image',
    'about_image' => 'About image',
    'favicon'     => 'Favicon',
);

foreach ($image_fields as $k => $l) {
    $add($k, $l, 'image', 'images');
}

for ($i = 1; $i <= 5; $i++) {
    $add(
        'service' . $i . '_image',
        'Service ' . $i . ' image',
        'image',
        'images'
    );
}


10. CONTENT EDITABILITY

The following should be editable through Customizer:

Hero:
- eyebrow
- title
- description
- primary button
- primary URL
- secondary button
- secondary URL
- KPI values
- KPI labels
- KPI URLs

About:
- eyebrow
- title
- paragraphs
- mission
- vision

Services:
- eyebrow
- title
- intro
- service title
- service description
- service URL
- service image

Process:
- eyebrow
- title
- intro
- process titles
- process descriptions
- process URLs

Industries:
- eyebrow
- title
- intro
- button
- button URL
- industries list

Contact:
- eyebrow
- title
- intro
- email
- phone
- WhatsApp
- company
- office address
- footnote
- form labels/content

Footer:
- tagline
- copyright
- slogan
- Facebook URL
- Instagram URL
- LinkedIn URL


11. IMPORTANT FRONTEND CORRECTIONS

Do not hard-code values if a corresponding Customizer field exists.

For example, instead of:

<h2>Five practices, deliberately<br>kept under <em>one roof.</em></h2>

use:

<h2><?php echo wp_kses_post(zelora_mod('services_title')); ?></h2>

Instead of:

<h2>A sequence, <em>not a menu.</em></h2>

use:

<h2><?php echo wp_kses_post(zelora_mod('process_title')); ?></h2>

Instead of:

<h2>Where this work <em>fits.</em></h2>

use:

<h2><?php echo wp_kses_post(zelora_mod('industries_title')); ?></h2>

All corresponding Customizer fields should actually appear on the frontend.


12. WORDPRESS SESSION ERROR

The WordPress admin is currently accessed through:

http://192.168.0.10/zelora_wp/

The WordPress admin showed:

"Your session has expired. Please log in to continue where you left off."

Troubleshooting should focus on:

- wp-config.php
- WP_HOME
- WP_SITEURL
- WordPress authentication cookies
- browser cookies
- WordPress nonce/session expiration
- plugin conflicts
- database wp_options values

If using:

define('WP_HOME', 'http://192.168.0.10/zelora_wp');
define('WP_SITEURL', 'http://192.168.0.10/zelora_wp');

do not simultaneously use localhost URLs.

Check wp_options:
- siteurl
- home

Both should match the actual URL being used.

If the session expires repeatedly, check WordPress salts and temporarily disable non-essential plugins.

Do not assume this session issue is caused by the Zelora theme unless evidence indicates it.


13. CODING STYLE

- Provide exact replacement code.
- Clearly identify which existing block should be replaced.
- Preserve existing functionality.
- Do not unnecessarily rewrite unrelated code.
- Use WordPress coding standards where practical.
- Escape frontend output appropriately.
- Use `esc_url()` for URLs.
- Use `esc_attr()` for HTML attributes.
- Use `esc_html()` for plain text.
- Use `wp_kses_post()` when HTML is intentionally allowed.
- Use `nl2br(esc_html(...))` for multiline address output.
- Use attachment IDs for Customizer-uploaded images.
- Avoid hard-coded image paths when a Customizer field exists.
- When a file is uploaded, inspect the actual file before recommending changes.
- If a problem remains after code correction, diagnose the actual saved value, generated HTML, browser cache, WordPress URL configuration, and server behavior instead of repeatedly changing unrelated code.

The goal is a fully editable, production-quality Zelora WordPress corporate website where homepage content, images, logos, favicon, contact details, and office address can all be managed from WordPress Customizer.