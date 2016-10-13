
[![Build Status](https://travis-ci.org/chamaconekt/hela-c2b-validation.svg?branch=master)](https://travis-ci.org/chamaconekt/hela-c2b-validation)


# Implementation of [Safaricom](https://safaricom.co.ke/) Paybill [API](http://www.safaricom.co.ke/business/corporate/m-pesa-payments-services/m-pesa-api) for Chamarika.

The new M-PESA platform dubbed G2 (for M-PESA 2nd generation platform) offers versatile integration capabilities that can take advantage of, to create excellent M-PESA journeys across the offerings we provide . 

## 1.Why the need for M-PESA API intergration with Chamarika ?

The new M-PESA platform dubbed G2 (for M-PESA 2nd generation platform) offers versatile integration capabilities that can take advantage of, to create excellent M-PESA journeys across the offerings we provide . 

M-PESA has been very successful mainly because of its simplicity of use and device agnostic nature – works the same way for the latest iPhone as the good old Nokia phone that has been passed over several user generations. The API rides on the same concept, providing open interfaces over standard protocols through web services. Unlike the old system (G1) where a lot of workarounds had been done to automate payment experiences, Chamarika can now hook directly to the core M-PESA and get creative with the systems we run. 

So far the following are some of the payments use cases.

   * **Automated Payment Receipt Processing:** Imagine the different scenarios that require customers to pay and have this processed instantly! Before G2, this was handled purely through Instant Payment Notification (IPN) which has served quite well. As the name indicates, IPN is only for notification processing. The use cases for payment processing are as many as your imagination can get – from utility bills to m/ecommerce, and the future is likely to get even more interesting.

   With the new system, the notifications are taken a notch higher by incorporating an optional payment validation step for Paybill. This allows the payment recipient (merchants) to confirm whether to accept the incoming payment or not. While this may not sound very beneficial at the face of it, think of how many customers send payments to the right Paybill number but enter the wrong account. Money moves from the customer's M-PESA account but their service payment will not be processed and they have to follow up. This has been creating a big problem with the merchants, leading to massive reversal requests. This can now be handled through the validation API which allows the recipient to validate any of the payment parameters, including, account, amount and even sender and only accept the payment if processing can be guaranteed.

   * **Automated Payment Disbursements:** Many systems that process receipts will also require outward payments processing. This could range from employees' salary disbursements to paying other merchants that accept M-PESA payments. This feature was only available via web portal for business to customers (B2C) with limitations on capacity that made it unsuitable for large disbursements. With the new platform, developers can have this done via API, which empowers them and cuts off the manual process of generating payments file, putting it in the right format then uploading it via the web portal, after which it has to be approved by a different user. With the B2C API, this is now seamless.

   * **Automated Payments Reversal:** Even with an elaborate system, there is always a unique case that calls for a reversal. Imagine a situation where a customer has made a payment for services that the merchant is no longer able to render. The best way to handle this would be to have a reversal process that the merchant can adapt based on their internal processes. G2 supports secure payment reversal automation for such cases. The implementation will fully depend on the service journey and controls required at the recipient's business.

Looking at the above use cases, one cannot fail to see the vast opportunity presented by the open interfaces. The future we once thought very distant of machine to machine payments is here and now. The only limitation to the adaption is the developer's imagination.




## 2.How does the service flow? 

This application interacts with the Safaficom [SOAP](http://www.w3.org/TR/soap) based Web Services described using [WSDL](http://www.w3.org/TR/wsdl) via a SOAP connector.

This repository initiates a customer PayBill/Buy Goods transaction via the Safaricom SOAP API channel. 

Unfortunately, SOAP is fairly heavy weight, and working with XML-based SOAP payloads in Node.js is not very fun.  It’s much nicer to use JSON and to wrap or mediate a SOAP service and expose it as a REST API.

We have implemented an API server to glue existing and new data sources to facilitate our backend data integration.  

This repository easily consumes SOAP web services and transforms them into REST APIs

![Chamarika Service Flow](/client/chamarika.png)


* A customer initates a Paybill or Buy Goods transaction in the Chamarika payment checkout portal.The transaction request is sent to the M-Pesa system for processing.

* The M-pesa system authorizes the transaction in the reserve fund.

* An external transaction validation request is then sent to Chamarika via the Broker. 

* The M-Pesa system completes or cancels the corresponding payment transaction depending on fund availability.

- If the correct response (the Result Code parameter from Chamarika is 0) is received from the Broker, the Mobile Money system will complete the corresponding payment transaction. The transaction status will be changed to ‘Completed’.
- If error response is replied by the Broker (the Result Code parameter from Chamarika value is not 0), the Mobile Money system will cancel the corresponding payment transaction. The transaction status will be changed to ‘Cancelled’.

* Chamarika is registered in the broker, and has provided a callback URL for the Confirmation and the Validation and a default response when they are unreachable for the validation. 

* After the validation, the M-Pesa system will complete the transaction. When the transaction is completed, besides SMS notifications will be sent to the Customer, a transaction confirmation message will also be sent to Chamarika via Broker. Chamarika then captures the transactions from the confirmation message.

The confirmation message has no effect in the processing of the transaction.

## How did we get to implement this?

First , one needs to connect to the Safaricom M-pesa system. This is only possible via an inter-VPN connection.Safaricom has provided its VPN configuration information to enable developers to set-up their VPN.

This includes;

Part 1
   * **Supplier:** Cisco
   * **Type:** ASA 5540
   * **Model**
   * **OS**
   * **Peer Address:** 196.201.212.240
   * **Test Peer Address**

Part 2
   * **Proposal Name:** IKE-3DES-SHA
   * **Authenticated Mode** : Pre-shared Key
   * **Preshared Key:** To be shared later
   * **Authentification Algorithm:** SHA
   * **Encrytion Algorithm:** 3DES-168
   * **Diffie-Hellman Group:** Group 2(1024 bits)
   * **Lifetime Measurement:** Time
   * **Lifetime:** 86400

Part 3
   * **Authentification Algorithm:** ESP/SHA
   * **Encryption LLgorithm:** AES-128
   * **Encapsulation Mode:** ESP Tunnel
   * **Perfect Forwaard Secrecy:** Disabled
   * **Lifetime Measurement:** Time
   * **Lifetime:** 3600

Part 4
   * **Network Servers**
      * 196.201.214.136
      * 196.201.214.137
      * 196.201.214.127
      * 196.201.214.145
      * 196.201.214.144
      * 196.201.214.94
      * 96.201.214.95

   * **Port Numbers**
      * 8310 
      * 18323
      * 18423
      * 80
      * 8080


Step two involves connecting to the Safaricom paybill API.Lets break them down.


This repository initiates a customer PayBill/Buy Goods transaction via the Safaricom SOAP API channel.Unfortunately, SOAP is fairly heavy weight, and working with XML-based SOAP payloads in Node.js is not very fun.  It’s much nicer to use JSON and to wrap or mediate a SOAP service and expose it as a REST API.

We have implemented an API server to glue existing and new data sources to facilitate our backend data integration.We consume SOAP web services and transforms them into REST APIs

## Steps

### 1.Configure a SOAP data source

To invoke a SOAP web service using LoopBack, first configure a data source backed by the SOAP connector.

```js
   var ds = loopback.createDataSource('soap', {
        connector: 'loopback-connector-soap'
        remotingEnabled: true,
        wsdl: 'http://cps.huawei.com/cpsinterface/c2bpayment/wsdl/CPSInterface_C2BPaymentValidationAndConfirmation.wsdl'
    });
```

SOAP web services are formally described using WSDL (Web Service Description Language) that specifies the operations, input, output and fault messages, and how the messages are mapped to protocols.  So, the most critical information to configure a SOAP data source is a WSDL document.  LoopBack introspects the WSDL document to map service operations into model methods.

### 2.Options for the SOAP connector


- **wsdl**: HTTP URL or local file system path to the WSDL file, if not present, defaults to <soap web service url>?wsdl.
    
- **url**: URL to the SOAP web service endpoint. If not present, the location attribute of the SOAP address for the service/port from the WSDL document will be used. For example:

```xml
<wsdl:service name="C2BPaymentValidationAndConfirmationService">
        <wsdl:port name="C2BPaymentValidationAndConfirmationServicePort" binding="c2bpayment:C2BPaymentValidationAndConfirmationBinding">
            <soap:address location="http://cps.huawei.com/cpsinterface/c2bpayment/wsdl/CPSInterface_C2BPaymentValidationAndConfirmation.wsdl" />
        </wsdl:port>
        ...
</wsdl:service>
```

- **remotingEnabled**: Indicates if the operations will be further exposed as REST APIs

- **wsdl_options**: Indicates additonal options to pass to the soap connector. for example allowing self signed certificates:

```js
    wsdl_options: {
        rejectUnauthorized: false,
        strictSSL: false,
        requestCert: true,
    },
```

- **operations**: Maps WSDL binding operations to Node.js methods

```js
operations: {
      // The key is the method name
      paymentValidation: {
        service: 'C2BPaymentValidationAndConfirmationService', // The WSDL service name
        port: 'C2BPaymentValidationAndComfirmation', // The WSDL port name
        operation: 'ValidateC2BPayment' // The WSDL operation name
      },
      paymentConfirmation: {
        service: 'C2BPaymentValidationAndConfirmationService', // The WSDL service name
        port: 'C2BPaymentValidationAndComfirmation', // The WSDL port name
        operation: 'ConfirmC2BPayment' // The WSDL operation name
      }
    }
```
- **security**: Security configuration

```js
    security: {
        scheme: 'WS',
        username: 'test',
        password: 'testpass',
        passwordType: 'PasswordDigest'
   }
```
The valid schemes are 'WS' (or 'WSSecurity'), 'BasicAuth', and 'ClientSSL'.

  - WS
    - username: the user name
    - password: the password
    - passwordType: default to 'PasswordText'

  - BasicAuth
    - username: the user name
    - password: the password

  - ClientSSL
    - keyPath: path to the private key file
    - certPath: path to the certificate file

- **soapHeaders**: custom soap headers

```js
    soapHeaders: [{
        element: {myHeader: 'XYZ'}, // The XML element in JSON object format
        prefix: 'p1', // The XML namespace prefix for the header
        namespace: 'http://ns1' // The XML namespace URI for the header
    }]
```
The property value should be an array of objects that can be mapped to xml elements
or xml strings.

### 3.Create a model from the SOAP data source 

**NOTE** The SOAP connector loads the WSDL document asynchronously. As a result, the data source won’t be ready to create models until it’s connected. The recommended way is to use an event handler for the ‘connected’ event.

```js
    ds.once('connected', function () {

        // Create the model
        var C2BPaymentValidationAndConfirmationService = ds.createModel('C2BPaymentValidationAndConfirmationService', {});

        ...
    }
```



### 4.Extend a model to wrap/mediate SOAP operations

Once the model is defined, it can be wrapped or mediated to define new methods. The following example simplifies the GetCityForecastByZIP operation to a method that takes zip and returns an array of forecasts.

```js
// Refine the methods
    WeatherService.forecast = function (zip, cb) {
        WeatherService.GetCityForecastByZIP({ZIP: zip || '94555'}, function (err, response) {
            console.log('Forecast: %j', response);
            var result = (!err && response.GetCityForecastByZIPResult.Success) ?
            response.GetCityForecastByZIPResult.ForecastResult.Forecast : [];
            cb(err, result);
        });
    };
```
The custom method on the model can be exposed as REST APIs. It uses the loopback.remoteMethod to define the mappings.

```js
// Map to REST/HTTP
    loopback.remoteMethod(
        WeatherService.forecast, {
            accepts: [
                {arg: 'zip', type: 'string', required: true,
                http: {source: 'query'}}
            ],
            returns: {arg: 'result', type: 'object', root: true},
            http: {verb: 'get', path: '/forecast'}
        }
    );
```


**PayBill Transaction Validation Request from M-Pesa to Broker** 

The C2BPaymentConfirmationResult message from Broker to M-Pesa is free text, no functional usage of this free text. It is only recorded in back-end log file in the M-Pesa system for traceability. 


Sample SOAP C2BPaymentValidationRequest xml Message

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:c2b="http://cps.huawei.com/cpsinterface/c2bpayment">
   <soapenv:Header/>
   <soapenv:Body>
      <c2b:C2BPaymentValidationRequest>
         <TransactionType>PayBill</TransactionType>
         <TransID>1234560000007031</TransID>
         <TransTime>20140227082020</TransTime>
         <TransAmount>123.00</TransAmount>
         <BusinessShortCode>12345</BusinessShortCode>
         <BillRefNumber></BillRefNumber>
         <InvoiceNumber></InvoiceNumber>
<MSISDN>254722703614</MSISDN>
         <KYCInfo>
			<KYCName>[Personal Details][First Name]</KYCName>
			<KYCValue>Hoiyor</KYCValue>
		</KYCInfo>
		<KYCInfo>
			<KYCName>[Personal Details][Middle Name]</KYCName>
			<KYCValue>G</KYCValue>
		</KYCInfo>
		<KYCInfo>
			<KYCName>[Personal Details][Last Name]</KYCName>
			<KYCValue>Chen</KYCValue>
		</KYCInfo>
      </c2b:C2BPaymentValidationRequest>
   </soapenv:Body>
</soapenv:Envelope>
```
GGGGGG

**PayBill Transaction Validation Result from Broker to M-Pesa**

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:c2b="http://cps.huawei.com/cpsinterface/c2bpayment">
   <soapenv:Header/>
   <soapenv:Body>
      <c2b:C2BPaymentValidationResult>
        <ResultCode>0</ResultCode>
	   <ResultDesc>Service processing successful</ResultDesc>
	   <ThirdPartyTransID>1234560000088888</ThirdPartyTransID>
      </c2b:C2BPaymentValidationResult>
   </soapenv:Body>
</soapenv:Envelope>
```
GGGGGG

**PayBill Transaction Confirmation Request from M-Pesa to Broker** 


```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:c2b="http://cps.huawei.com/cpsinterface/c2bpayment">
   <soapenv:Header/>
   <soapenv:Body>
      <c2b:C2BPaymentConfirmationRequest>
         <TransactionType>PayBill</TransactionType>
         <TransID>1234560000007031</TransID>
         <TransTime>20140227082020</TransTime>
         <TransAmount>123.00</TransAmount>
         <BusinessShortCode>12345</BusinessShortCode>
         <BillRefNumber>TX1001</BillRefNumber>
         <InvoiceNumber></InvoiceNumber>
         <OrgAccountBalance>12345.00</OrgAccountBalance>
<ThirdPartyTransID></ThirdPartyTransID>
<MSISDN>254722703614</MSISDN>
         <KYCInfo>
			<KYCName>[Personal Details][First Name]</KYCName>
			<KYCValue>Hoiyor</KYCValue>
		</KYCInfo>
		<KYCInfo>
			<KYCName>[Personal Details][Middle Name]</KYCName>
			<KYCValue>G</KYCValue>
		</KYCInfo>
		<KYCInfo>
			<KYCName>[Personal Details][Last Name]</KYCName>
			<KYCValue>Chen</KYCValue>
		</KYCInfo>
      </c2b:C2BPaymentConfirmationRequest>
   </soapenv:Body>
</soapenv:Envelope>
```
GGGGGGG

**PayBill Transaction Confirmation Result from Broker to M-Pesa**

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:c2b="http://cps.huawei.com/cpsinterface/c2bpayment">
   <soapenv:Header/>
   <soapenv:Body>
      <c2b:C2BPaymentConfirmationResult>C2B Payment Transaction 1234560000007031 result received.</c2b:C2BPaymentConfirmationResult>
   </soapenv:Body>
</soapenv:Envelope>
```



