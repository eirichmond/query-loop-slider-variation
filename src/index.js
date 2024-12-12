import { registerBlockVariation } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";
import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import { PanelBody, RangeControl } from "@wordpress/components";
import { Fragment } from "@wordpress/element";

// Register the block variation
registerBlockVariation("core/query", {
	name: "query-loop-carousel",
	title: __("Query Loop Carousel", "query-loop-slider-variation"),
	attributes: {
		className: "query-loop-carousel",
		itemsToShow: {
			type: "number",
			default: 3,
		},
	},
	innerBlocks: [
		{
			name: "core/buttons",
			innerBlocks: [
				{
					name: "core/button",
					attributes: {
						className: "carousel-prev",
					},
				},
				{
					name: "core/button",
					attributes: {
						className: "carousel-next",
					},
				},
			],
		},
		{
			name: "core/post-template",
			attributes: {
				className: "carousel-post-template",
			},
		},
	],
	isDefault: false,
});

// Add attributes to the core/query block
const addCarouselAttributes = (settings, name) => {
	if (name !== "core/query") {
		return settings;
	}

	settings.attributes = {
		...settings.attributes,
		itemsToShow: {
			type: "number",
			default: 3,
		},
	};

	return settings;
};

addFilter(
	"blocks.registerBlockType",
	"query-loop-slider-variation/query-loop-carousel-attributes",
	addCarouselAttributes
);

// Create a higher-order component to add the InspectorControls
const withCarouselControls = createHigherOrderComponent(BlockEdit => {
	return props => {
		if (props.name !== "core/query") {
			return <BlockEdit {...props} />;
		}
		const { attributes, setAttributes } = props;
		const { itemsToShow } = attributes;

		// Generate dynamic block props
		const blockProps = useBlockProps({
			style: {
				"--items-per-view": itemsToShow,
			},
			"data-items-to-show": itemsToShow,
		});

		return (
			<Fragment>
				<div {...blockProps}>
					<BlockEdit {...props} />
				</div>
				<InspectorControls>
					<PanelBody
						title={__(
							"Carousel Settings",
							"query-loop-slider-variation"
						)}>
						<RangeControl
							label={__(
								"Items to Show",
								"query-loop-slider-variation"
							)}
							value={itemsToShow}
							onChange={value =>
								setAttributes({ itemsToShow: value })
							}
							min={1}
							max={attributes.query.perPage}
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, "withCarouselControls");

addFilter(
	"editor.BlockEdit",
	"query-loop-slider-variation/query-loop-carousel-controls",
	withCarouselControls
);
