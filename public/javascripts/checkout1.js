var stripe=Stripe('pk_test_51IDNKtIVaTKuotVn7D7BkjX37IP7cc3iOcnC6pEthdR0eLC9lG3xQ0QbMdNAI7I9GoI3BIq7kfeP0e0MFVezFC3p00dMPnNzwT');

$('#checkout-form').on('submit', function(event){
    $('#card-errors').addClass('visually-hidden');
    $('#checkout-form').find('button').prop('disabled', true);
    stripe.createToken({
        name: $('#card-name').val(),
        number: $('#card-number').val(),
        cvc: $('#card-cvc').val(),
        exp_month: $('#card-expiry-month').val(),
        exp_year: $('#card-expiry-year').val()
    }, stripeResponseHandler );
    return false;
});

function stripeResponseHandler(status, response) {
    if (response.error) { // Problem!
        // Show the errors on the form
        $('#card-errors').text  (response.error.message);
        $('#card-errors').removeClass('visually-hidden');
        $('#checkout-form').find('button').prop('disabled', false); // Re-enable submission

    } else { // Token was created!

        // Get the token ID:
        var myToken = response.myToken;
        //alert('token');
        // Insert the token into the form so it gets submitted to the server:
        $('#checkout-form').append($('<input type="hidden" name="stripeToken" />').val(myToken));

        // Submit the form:
        $('#checkout-form').get(0).submit();

    }
}
    
