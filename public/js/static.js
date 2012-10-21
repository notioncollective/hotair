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
		var submitButton = $(this),
				token = HA.getCsrfToken(),
				email_re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				valErrors = false;
		
		submitButton.attr("disabled", true);		
		submitButton.html("Sending...");		

				
		$('#messages')
			.html('')
			.removeClass('error')
			.removeClass('success')
			.hide();
			
		console.log("fromName", $('#fromName').val().length);
	
		if(!_.isString($('#fromName').val() || $('#fromName').val().length < 1)) {
			$('#messages')
				.append('<li>You must include a name</li>')
				.addClass('error');				
			valErrors = true;
		}
		if(
			!_.isString($('#fromEmail').val()
			|| $('#fromEmail').val().length < 1)
			|| !email_re.test($('#fromEmail').val())) {
			$('#messages')
				.append('<li>You must include a valid email</li>')
				.addClass('error');
			valErrors = true;	
		}
		if(!_.isString($('#emailBody').val() || $('#emailBody').val().length < 1)) {
			$('#messages')
				.append('<li>You didn\'t write a message!</li>')
				.addClass('error');
			valErrors = true;	
		}

		if(valErrors) {
			console.log("validation errors detected");
			$('#messages').show();
			submitButton.removeAttr('disabled');
			submitButton.html("Send!");		
			return false;
		}
		
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
				console.log("submit email response", resp);
				if(resp.errors) {
					$('#messages')
						.html('')
						.addClass('error');
					
					// show errors
					_.each(resp.errors, function(err) {
						console.log("append error", err);
						$('#messages').append('<li>'+err+' :(</li>');
					});
					
					$('#messages').show();
					
					$('#submit').removeAttr('disabled');
					submitButton.html("Send!");		
						
				} else {
					$('#messages')
						.addClass('success')
						.html('<li>Submitted successfully! :)</li>')
						.show();
						
					$('#fromName').val('');
					$('#fromEmail').val('');
					$('#emailBody').val('');
					$('#submit').removeAttr('disabled');
					submitButton.html("Send!");		
				} 	
			}
		});		
		
		return false;
	}
		
})