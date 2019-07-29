Drupal.behaviors.bxdev_drag = function(){
	// make the images draggable
	$('#field_image_cache_values .imagefield-preview img').draggable({
		opacity: 0.8,
		cursor: 'move',
		helper: 'clone',
	});

	$('.thrifted-image').droppable({
		hoverClass: 'thrifted-hover',
		drop: function(event, ui){

			// get the imagecache preset from the drop target
			var imagecache_preset = $(event.target).attr('imagecache');

			// cache $this
			var $this = $(this);
			// add a loader
			$this.html('<img src="/sites/all/themes/bx/images/ajax-loader.gif" class="thrifted-loader"/>');
			// get the image file name
			var image_file = $(ui.draggable).attr('title');

			// fire ajax call to get imagecache markup
			$.post('/admin/drag/imagecache', {cid: imagecache_preset, filepath: image_file}, function(data){
				// inject image
				$this.html(data);
				// add the remove control
				$this.prepend('<a class="thrifted-remove" href="">remove</a>');
				// serialize_images();
			});

		}
	});

	// fade the remove control on hover
	$('.thrifted-image').hover(function() {
		$(this).find('.thrifted-remove').stop(true, true).fadeIn(200);
	}, function() {
		$(this).find('.thrifted-remove').stop(true, true).fadeOut(200);
	});


	// remove the selected image
	$('.thrifted-remove').live('click', function(event) {
		// immediately hide the remove control
		$(this).hide();
		// fade out the image
		$(this).parent().find('img').fadeOut(200, function(){
			// clear the container
			$(this).parent().empty();
		});
		return false;
	});

	change_layout_display();

	// change display when new layout is selected
	$('#edit-field-prod-image-layout-value').change(function() {
		change_layout_display();
	});

	$('#node-form').submit(function() {
		serialize_images();
		return true;
	});

	// changes display based on layout select
	function change_layout_display(){
		$('.thrifted-image-wrap').hide();
		var layout_value = $('#edit-field-prod-image-layout-value').val();
		$('.thrifted-image-wrap-'+layout_value).show();
	}

	// set the hidden image input
	function serialize_images(){
		var layout_value = $('#edit-field-prod-image-layout-value').val();
		var layout_array = [];
		$('.thrifted-image-wrap-'+layout_value+' .thrifted-image').each(function(index) {
		  layout_array[index] = $(this).find('img').attr('src');
		});
		$('#edit-bxdev-drag-images').html(layout_array.join());
	}

	// turns js array into serialized php array
	function js_array_to_php_array(a){
		var a_php = "";
		var total = 0;
		for (var key in a){
			++ total;
			a_php = a_php + "s:" +
				String(key).length + ":\"" + String(key) + "\";s:" +
				String(a[key]).length + ":\"" + String(a[key]) + "\";";
		}
		a_php = "a:" + total + ":{" + a_php + "}";
		return a_php;
	}
