<?php

/**
 * Implementation of hook_form_alter()
 */
function bxdev_drag_form_alter(&$form, $form_state, $form_id){
	if($form_id == 'thrifted_product_node_form' && arg(2) == 'drag'){
		$form['buttons']['submit']['#submit'][] = 'bxdev_drag_thrifted_product_node_submit';
		$form['field_prod_image_layout']['#weight'] = 50;
		$form['bxdev_drag_images'] = array(
			'#type' => 'textarea',
			'#weight' => 50,
			'#resizable' => FALSE,
		);
	}
}

function bxdev_drag_thrifted_product_node_submit($form, &$form_state){
	// redirect to itself
	$form_state['redirect'] = substr($_SERVER['REQUEST_URI'], 1);
	// get the images value
	$images = $form_state['values']['bxdev_drag_images'];
	// get the nid value
	$nid = $form_state['values']['nid'];
	// update the db
	if($result = db_query("UPDATE content_type_thrifted_product SET field_prod_bxdev_drag_images = '$images' WHERE nid = '$nid'")){
		drupal_set_message('Image layout has been saved.');
	}else{
		drupal_set_message('Something terrible has happened.', 'error');
	}
}

/**
 * Implementation of hook_init().
 */
function bxdev_drag_init(){
	if ($admin_theme = variable_get('admin_theme', 0)) {
		if (arg(0) == 'node' && arg(2) == 'drag') {
			global $custom_theme;
			$custom_theme = $admin_theme;
			jquery_ui_add(array('ui.draggable', 'ui.droppable', 'ui.sortable'));
			drupal_add_css(drupal_get_path('module', 'bxdev_drag') .'/bxdev_drag.css');
			drupal_add_js(drupal_get_path('module', 'bxdev_drag') .'/bxdev_drag.js');
		}
	}
}

/**
 * Implementation of hook_perm().
 */
function bxdev_drag_perm(){
	return array('access image layout');
}

/**
 * Implementation of hook_menu().
 */
function bxdev_drag_menu() {
	$items['node/%node/drag'] = array(
		'title' => 'Image layout',
		'page callback' => 'bxdev_drag_node_drag',
		'page arguments' => array(1),
		'access callback' => 'bxdev_drag_check_type',
		'access arguments' => array(1),
		'weight' => 5,
		'type' => MENU_LOCAL_TASK,
	);

	$items['admin/drag/imagecache'] = array(
		'page callback' => 'bxdev_get_imagecache',
		'type' => MENU_CALLBACK,
		'access arguments' => array('access content'),
	);

	return $items;
}

// check if node type is thrifted product
function bxdev_drag_check_type($node){
	if($node->type == 'thrifted_product' && user_access('access image layout')){
		return TRUE;
	}
	return FALSE;
}

function bxdev_get_imagecache(){
	print theme('imagecache', $_POST['cid'], $_POST['filepath']);
}

function bxdev_drag_node_drag($node){
	// first get the node's edit form
	module_load_include('inc', 'node', 'node.pages');
	$form = '<div id="drag-form">' . drupal_get_form($node->type .'_node_form',  $node) . '</div>';

	$nid = $node->nid;
	$images_array = db_fetch_array(db_query("SELECT field_prod_bxdev_drag_images FROM content_type_thrifted_product WHERE nid = $nid"));
	$images_array = explode(',', $images_array['field_prod_bxdev_drag_images']);
	$image_layout = $node->field_prod_image_layout[0]['value'];

	// loop six times, one for each layout, and build the markup
	$output = $form . '<div id="drop-zone">';
	for ($i=0; $i < 6; $i++) {
		switch ($i) {
			case 0:
				$image1 = '';
				if($image_layout == 1 && $images_array[0] != ''){
					$image1 = '<a class="thrifted-remove" href="">remove</a><img src="' . $images_array[0] . '" />';
				}
				$output .= '
					<div class="thrifted-image-wrap thrifted-image-wrap-1">
						<div class="thrifted-image-1 thrifted-image" imagecache="335_335_scale">' . $image1 . '</div>
					</div>';
				break;

			case 1:
				$image1 = '';
				$image2 = '';
				if($image_layout == 2){
					$image1 = '<a class="thrifted-remove" href="">remove</a><img src="' . $images_array[0] . '" />';
					$image2 = '<a class="thrifted-remove" href="">remove</a><img src="' . $images_array[1] . '" />';
				}
				$output .= '
					<div class="thrifted-image-wrap thrifted-image-wrap-2">
						<div class="thrifted-image-1 thrifted-image" imagecache="335_335_scale">' . $image1 . '</div>
						<div class="thrifted-image-2 thrifted-image" imagecache="224_335_scale">' . $image2 . '</div>
					</div>';
				break;

			case 2:
				$image1 = '';
				$image2 = '';
				$image3 = '';
				if($image_layout == 3){
					$image1 = '<a class="thrifted-remove" href="">remove</a><img src="' . $images_array[0] . '" />';
					$image2 = '<a class="thrifted-remove" href="">remove</a><img src="' . $images_array[1] . '" />';
					$image3 = '<a class="thrifted-remove" href="">remove</a><img src="' . $images_array[2] . '" />';
				}
				$output .= '
					<div class="thrifted-image-wrap thrifted-image-wrap-3">
						<div class="thrifted-image-1 thrifted-image" imagecache="247_370_scale">' . $image1 . '</div>
						<div class="thrifted-image-2 thrifted-image" imagecache="217_217_scale">' . $image2 . '</div>
						<div class="thrifted-image-3 thrifted-image" imagecache="217_144_scale">' . $image3 . '</div>
					</div>';
				break;

			case 3:
				$image1 = '';
				$image2 = '';
				$image3 = '';
				$image4 = '';
				if($image_layout == 4){
					$image1 = '<a class="thrifted-remove" href="">remove</a><img src="' . $images_array[0] . '" />';
					$image2 = '<a class="thrifted-remove" href="">remove</a><img src="' . $images_array[1] . '" />';
					$image3 = '<a class="thrifted-remove" href="">remove</a><img src="' . $images_array[2] . '" />';
					$image4 = '<a class="thrifted-remove" href="">remove</a><img src="' . $images_array[3] . '" />';
				}
				$output .= '
					<div class="thrifted-image-wrap thrifted-image-wrap-4">
						<div class="thrifted-image-1 thrifted-image" imagecache="112_168_scale">' . $image1 . '</div>
						<div class="thrifted-image-2 thrifted-image" imagecache="168_168_scale">' . $image2 . '</div>
						<div class="thrifted-image-3 thrifted-image" imagecache="289_193_scale">' . $image3 . '</div>
						<div class="thrifted-image-4 thrifted-image" imagecache="247_370_scale">' . $image4 . '</div>
					</div>';
				break;

			case 4:
				$image1 = '';
				$image2 = '';
				$image3 = '';
				$image4 = '';
				$image5 = '';
				if($image_layout == 5){
					$image1 = '<a class="thrifted-remove" href="">remove</a><img src="' . $images_array[0] . '" />';
					$image2 = '<a class="thrifted-remove" href="">remove</a><img src="' . $images_array[1] . '" />';
					$image3 = '<a class="thrifted-remove" href="">remove</a><img src="' . $images_array[2] . '" />';
					$image4 = '<a class="thrifted-remove" href="">remove</a><img src="' . $images_array[3] . '" />';
					$image5 = '<a class="thrifted-remove" href="">remove</a><img src="' . $images_array[4] . '" />';
				}
				$output .= '
					<div class="thrifted-image-wrap thrifted-image-wrap-5">
						<div class="thrifted-image-1 thrifted-image" imagecache="146_146_scale">' . $image1 . '</div>
						<div class="thrifted-image-2 thrifted-image" imagecache="146_219_scale">' . $image2 . '</div>
						<div class="thrifted-image-3 thrifted-image" imagecache="249_374_scale">' . $image3 . '</div>
						<div class="thrifted-image-4 thrifted-image" imagecache="218_218_scale">' . $image4 . '</div>
						<div class="thrifted-image-5 thrifted-image" imagecache="218_145_scale">' . $image5 . '</div>
					</div>';
				break;

			case 5:
				$image1 = '';
				$image2 = '';
				$image3 = '';
				$image4 = '';
				$image5 = '';
				$image6 = '';
				if($image_layout == 6){
					$image1 = '<a class="thrifted-remove" href="">remove</a><img src="' . $images_array[0] . '" />';
					$image2 = '<a class="thrifted-remove" href="">remove</a><img src="' . $images_array[1] . '" />';
					$image3 = '<a class="thrifted-remove" href="">remove</a><img src="' . $images_array[2] . '" />';
					$image4 = '<a class="thrifted-remove" href="">remove</a><img src="' . $images_array[3] . '" />';
					$image5 = '<a class="thrifted-remove" href="">remove</a><img src="' . $images_array[4] . '" />';
					$image6 = '<a class="thrifted-remove" href="">remove</a><img src="' . $images_array[5] . '" />';
				}
				$output .= '
					<div class="thrifted-image-wrap thrifted-image-wrap-6">
						<div class="thrifted-image-1 thrifted-image" imagecache="132_198_scale">' . $image1 . '</div>
						<div class="thrifted-image-2 thrifted-image" imagecache="132_132_scale">' . $image2 . '</div>
						<div class="thrifted-image-3 thrifted-image" imagecache="224_336_scale">' . $image3 . '</div>
						<div class="thrifted-image-4 thrifted-image" imagecache="153_153_scale">' . $image4 . '</div>
						<div class="thrifted-image-5 thrifted-image" imagecache="102_153_scale">' . $image5 . '</div>
						<div class="thrifted-image-6 thrifted-image" imagecache="264_176_scale">' . $image6 . '</div>
					</div>';
				break;
		}
	}

	$output .= '</div>';

	return $output;
}

?>
