<?php
/**
 * Plugin Name:       Query Loop Slider Variation
 * Description:       A Query Look Block Variation.
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       query-loop-slider-variation
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_query_loop_slider_variation_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'create_block_query_loop_slider_variation_block_init' );


// Enqueue styles and scripts for frontend and backend
function register_query_loop_carousel_assets() {
    // Common styles for both editor and frontend
    wp_enqueue_style(
        'query-loop-slider-variation-style',
        plugin_dir_url(__FILE__) . 'css/query-loop-slider-variation.css',
        array(),
        filemtime( plugin_dir_path(__FILE__) . 'css/query-loop-slider-variation.css' )
	);

	$dependencies = array('wp-element', 'wp-dom-ready'); // Common dependencies

	// Add backend-specific dependencies if in the block editor
	if (is_admin()) {
		add_action('current_screen', function($screen) use (&$dependencies) {
			if ($screen && $screen->is_block_editor) { // Check if in block editor
				$dependencies = array_merge($dependencies, array('wp-edit-post', 'wp-blocks', 'wp-editor'));
			}
		});
	}

    // Frontend-only script
	wp_enqueue_script(
		'query-loop-slider-variation',
		plugin_dir_url(__FILE__) . 'js/query-loop-slider-variation.js',
		$dependencies,
		filemtime( plugin_dir_path(__FILE__) . 'js/query-loop-slider-variation.js' ),
		true
	);

}
add_action('enqueue_block_assets', 'register_query_loop_carousel_assets');

add_filter( 'render_block_core/query', 'register_query_loop_carousel', 10, 2 );

function register_query_loop_carousel ( $block_content, $block ) {
    // Only target the "query-loop-carousel" variation
    if ( isset($block['attrs']['className']) && strpos($block['attrs']['className'], 'query-loop-carousel') !== false ) {
        // Ensure WP_HTML_Tag_Processor is available
        if (class_exists('WP_HTML_Tag_Processor')) {
            $processor = new WP_HTML_Tag_Processor($block_content);

            // Find the first <div> tag with the "query-loop-carousel" class
            if ($processor->next_tag(['tag' => 'div', 'class_name' => 'query-loop-carousel'])) {
                $items_to_show = isset($block['attrs']['itemsToShow']) ? (int)$block['attrs']['itemsToShow'] : 3;

                // Add CSS variable for --items-per-view
                $style = $processor->get_attribute('style');
                $style .= " --items-per-view: {$items_to_show};";
                $processor->set_attribute('style', $style);

                // Add data attribute for items-to-show
                $processor->set_attribute('data-items-to-show', (string)$items_to_show);

                // Replace the original content with the modified content
                $block_content = $processor->get_updated_html();
            }
        }
    }

    return $block_content;
}
