jQuery(function($){
	// if($('#notsupported').length > 0) {
	// 	var blink = window.setInterval(function(){$('h1').toggle();}, 2000);
	// }
	HA.init();
	
	if($('#ContactForm').length > 0) {
		$('#messages').hide();
		$('#submit').off().on('click', _handleContactFormSubmit);
	}
	
	function _handleContactFormSubmit(e) {
		var token = HA.getCsrfToken();
						
		$.ajax({
			url : "/contact/send",
			type : "post",
			contentType : "application/json",
			data : JSON.stringify({
				from_name: $('#fromName').val(),
				from_email: $('#fromEmail').val(),
				email_body: $('#emailBody').val()			
			}),
			success : function(resp) {
				// var resp = JSON.parse(resp);
				if(resp.errors) {
					
					$('#messages')
						.html('')
						.addClass('error');
					
					// show errors
					_.each(resp.errors, function(err) {
						$('li').html(err).appendTo('#messages');
					});
					
					$('#messages').show();
						
				} else {
					$('#messages')
						.addClass('error')
						.html('<li>Submitted successfully!</li>')
						.show();
				} 	
			}
		});		
		
		return false;
	}
		
})