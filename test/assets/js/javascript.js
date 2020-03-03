$( document ).ready( function( ) { 
    // Validamos que el cliente que se conecte sea bajo un dispositivo con Safari
    if (window.ApplePaySession) {  
        var merchantIdentifier = 'merchant.pruebas.applepay';  
        var promise = ApplePaySession.canMakePaymentsWithActiveCard(merchantIdentifier);  
        promise.then(function (canMakePayments) { 
            
            if (canMakePayments)  {
                console.log('Apple Pay se puede mostrar correctamente');  
                $("#applePay").show().addClass("btn btn-block btn-dark");; 
                $("#applePay2").show();  
            }
        });  

    } else {  

        console.log('Apple Pay no es compatible con este dispositivo');

        if (window.navigator["vendor"] == '') {
            $("#applePay").after('Apple Pay no es compatible con el navegador '+ window.navigator["appCodeName"]);
            $("#applePay2").after('Apple Pay no es compatible con el navegador '+ window.navigator["appCodeName"]);
            $("#server-results").html('Apple Pay no es compatible con el navegador '+ window.navigator["appCodeName"]);
        } else {
            $("#applePay").after('Apple Pay no es compatible con el navegador '+ window.navigator["vendor"]);
            $("#applePay2").after('Apple Pay no es compatible con el navegador '+ window.navigator["vendor"]);
            $("#server-results").html('Apple Pay no es compatible con el navegador '+ window.navigator["vendor"]);
        }

        $("#botonApple").addClass("btn btn-block btn-outline-dark");
        $("#botonApple2").addClass("btn btn-block btn-outline-dark");
        $("#applePay").remove();
        $("#applePay2").remove();
    } 
      
    $("#applePay").click( function(event) {

        var paymentRequest = {  
            currencyCode: 'EUR',  
            countryCode: 'ES',  
            total: {  
           label: 'Addon Payments',  
           amount: '10'
            },  
            supportedNetworks: ['amex', 'discover', 'masterCard', 'visa' ],  
            merchantCapabilities: [ 'supports3DS', 'supportsCredit', 'supportsDebit' ],  
            requiredShippingAddressFields: [ 'postalAddress' ]  
        };  
          
        var session = new ApplePaySession(2, paymentRequest);   

        
        /** 
        * Enviamos la solicitud de sesión a nuestro archivo del servidor
        */
        function getSession(url) {
            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: 'session.php',
                    type: 'POST',
                    success: function(data) {
                        return resolve(JSON.parse(data));
                    },
                    error: function(error) { 
                        console.log(error);
                        return reject;
                    }
                });
            });
        };

        
        /**
        * Comprobación del comercio
        */
        session.onvalidatemerchant = (event) => {
            const validationURL = event.validationURL;
            var promise = getSession(event.validationURL);
            console.log('----------- Nueva petición de Apple Pay -----------');
            promise.then(function(response) {
              session.completeMerchantValidation(response);
              console.log('%c Session ','color: white; background-color: #65a93c', response);
              $("#server-results").html(response);
            });
        };

          
        /**
        * Se denomina así cuando el usuario descarta la modalidad de pago
        */
        session.oncancel = (event) => {
            // Añadir control de errores a la ventana modal
            console.log('%c Modal cancelado ','color: white; background-color: red', 'Ventana modal cerrada');
        };
        
         
        /**
        * Autorización
        * Aquí recibirá el token. Puede enviar el token a su servidor
        * donde se aloja el archivo que procesa la transacción con la pasarela de pagos
        * y le devuelve "status in session.completePayment()"
        */
        session.onpaymentauthorized = (event) => {
            const token = event.payment.token.paymentData;
            console.log('%c Token ','color: white; background-color: #22a58d', token);
            $("#server-results").html(token);
            
            // Convertimos a JSON el token recibido
            var datos = JSON.stringify(token);
            
            // Petición AJAX que envía los datos del token a su servidor
            $.ajax({
                url: 'Authorization.php',
                type: 'POST',
                data: {misDatos:datos},
                success: function(data) {
                    if(data.respuesta == '00') {
                        // Si la transacción es correcta (00), indicamos al modal que la transacción es correcta
                        session.completePayment(ApplePaySession.STATUS_SUCCESS);
                        console.log('%c Operación correcta ','color: white; background-color: #2274A5', data);
                        
                        // Pintamos en nuestro Front-End la respuesta de la pasarela de pagos
                        $("#server-results").append('Respuesta == '+ data.respuesta + '<br>');
                        $("#server-results").append('Mensaje == '+ data.mensaje + '<br>');
                        $("#server-results").append('Order ID == '+ data.orderid + '<br>');
                        $("#server-results").append('Código de autorización == '+ data.codeauth + '<br>');
                        $("#server-results").append('Transaction ID (PasRef) == '+ data.pasref);
                    } else {
                        // Si la transacción no es correcta, indicamos al modal que la transacción no se ha podido procesar
                        session.completePayment(ApplePaySession.STATUS_FAILURE);
                        console.log('%c Error al procesar su solicitud ','color: white; background-color: #D33F49',data);
                        $("#server-results").html('Error al procesar su solicitud: ' + data);
                    }
                },
                error: function(error) { console.log(error); }
            });
        };
        
        
        /**
        * Muestra el modal de Apple Pay
        */
        session.begin();
    });
    
    $("#applePay2").click( function(event) {

        var paymentRequest = {  
            currencyCode: 'EUR',  
            countryCode: 'ES',  
            total: {  
               label: 'Addon Payments',  
               amount: '11.01'
            },  
            supportedNetworks: ['amex', 'discover', 'masterCard', 'visa' ],  
            merchantCapabilities: [ 'supports3DS', 'supportsCredit', 'supportsDebit' ],  
            requiredShippingAddressFields: [ 'postalAddress' ]  
        };  
          
        var session = new ApplePaySession(2, paymentRequest);   

        
        /** 
        * Enviamos la solicitud de sesión a nuestro archivo del servidor
        */
        function getSession(url) {
            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: 'session.php',
                    type: 'POST',
                    success: function(data) {
                        return resolve(JSON.parse(data));
                    },
                    error: function(error) { 
                        console.log(error);
                        return reject;
                    }
                });
            });
        };

        
        /**
        * Comprobación del comercio
        */
        session.onvalidatemerchant = (event) => {
            const validationURL = event.validationURL;
            var promise = getSession(event.validationURL);
            console.log('----------- Nueva petición de Apple Pay -----------');
            promise.then(function(response) {
              session.completeMerchantValidation(response);
              console.log('%c Session ','color: white; background-color: #65a93c', response);
              $("#server-results").html(response);
            });
        };

          
        /**
        * Se denomina así cuando el usuario descarta la modalidad de pago
        */
        session.oncancel = (event) => {
            // Añadir control de errores a la ventana modal
            console.log('%c Modal cancelado ','color: white; background-color: red', 'Ventana modal cerrada');
        };
        
         
        /**
        * Autorización
        * Aquí recibirá el token. Puede enviar el token a su servidor
        * donde se aloja el archivo que procesa la transacción con la pasarela de pagos
        * y le devuelve "status in session.completePayment()"
        */
        session.onpaymentauthorized = (event) => {
            const token = event.payment.token.paymentData;
            console.log('%c Token ','color: white; background-color: #22a58d', token);
            $("#server-results").html(token);
            
            // Convertimos a JSON el token recibido
            var datos = JSON.stringify(token);
            
            // Petición AJAX que envía los datos del token a su servidor
            $.ajax({
                url: 'Authorization.php',
                type: 'POST',
                data: {misDatos:datos},
                success: function(data) {
                    if(data.respuesta == '00') {
                        // Si la transacción es correcta (00), indicamos al modal que la transacción es correcta
                        session.completePayment(ApplePaySession.STATUS_SUCCESS);
                        console.log('%c Operación correcta ','color: white; background-color: #2274A5', data);
                        $("#rspMsg").remove();
                        
                        // Pintamos en nuestro Front-End la respuesta de la pasarela de pagos
                        $("#server-results").append('Respuesta == '+ data.respuesta + '<br>');
                        $("#server-results").append('Mensaje == '+ data.mensaje + '<br>');
                        $("#server-results").append('Order ID == '+ data.orderid + '<br>');
                        $("#server-results").append('Código de autorización == '+ data.codeauth + '<br>');
                        $("#server-results").append('Transaction ID (PasRef) == '+ data.pasref);
                    } else {
                        // Si la transacción no es correcta, indicamos al modal que la transacción no se ha podido procesar
                        session.completePayment(ApplePaySession.STATUS_FAILURE);
                        console.log('%c Error al procesar su solicitud ','color: white; background-color: #D33F49',data);
                        $("#server-results").html('Error al procesar su solicitud: ' + data);
                    }
                },
                error: function(error) { console.log(error); }
            });
        };
        
        
        /**
        * Muestra el modal de Apple Pay
        */
        session.begin();
    });
});