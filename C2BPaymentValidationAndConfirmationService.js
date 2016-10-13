var loopback = require('loopback');

var ds = loopback.createDataSource('soap', {
    connector: 'loopback-connector-soap',
    remotingEnabled: true,
    wsdl: '/home/william/ChamaconektKenya/loopback-apps/hela-c2b-validation/CBPInterface_C2BPaymentValidationAndConfirmation.wsdl',
    wsdl_options: {
        rejectUnauthorised: false,
        strictSSL: false,
        requestCert: false,
    },
    operations: {
     
      // The key is the method name
      paymentValidation: {
        service: 'C2BPaymentValidationAndConfirmationService', // The WSDL service name
        port: 'C2BPaymentValidationAndComfirmation', // The WSDL port name
        operation: 'ValidateC2BPayment' // The WSDL operation name
      },
      paymentValidationResult: {
        service: 'C2BPaymentValidationAndConfirmationService', // The WSDL service name
        port: 'C2BPaymentValidationAndComfirmation', // The WSDL port name
        operation: 'ValidateC2BPayment' // The WSDL operation name
      },
      paymentConfirmation: {
        service: 'C2BPaymentValidationAndConfirmationService', // The WSDL service name
        port: 'C2BPaymentValidationAndComfirmation', // The WSDL port name
        operation: 'ConfirmC2BPayment' // The WSDL operation name
      },
      paymentConfirmationResult: {
        service: 'C2BPaymentValidationAndConfirmationService', // The WSDL service name
        port: 'C2BPaymentValidationAndComfirmation', // The WSDL port name
        operation: 'ConfirmC2BPayment' // The WSDL operation name
      }
    },

    security: {
        scheme: 'WS',
        username: 'test',
        password: 'testpass',
        passwordType: 'PasswordDigest'
   }

  
});


ds.once('connected', function () {

// Setting up a before-execute hook to dump out the request object

    ds.connector.observe('before execute', function(ctx, next) {
        console.log('http Request: ', ctx.req);
        next();
    });

// Creating the Model

var C2BPaymentValidationAndConfirmationService =ds.createModel('C2BPaymentValidationAndConfirmationService', {});

// Extend a model to wrap/mediate SOAP operations


});

