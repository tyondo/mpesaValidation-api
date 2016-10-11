
## Chamarika Paybill and Buy Goods [Safaricom](https://safaricom.co.ke/) [API](http://www.safaricom.co.ke/business/corporate/m-pesa-payments-services/m-pesa-api) Implementation

### Why the M-PESA API?

The new M-PESA platform dubbed G2 (for M-PESA 2nd generation platform) offers versatile integration capabilities that our development partners can take advantage of, to create excellent M-PESA journeys across the different industries they serve. This was a key factor in moving to the new platform. We have been consolidating the different interfaces our developers have expressed interest in to enable innovation around M-PESA. As expected, most of these are about the payment journeys, covering both disbursements (Business to Customers – B2C) and service payments (Customer to Business – C2B and Business to Business – B2B). These and other features are now available via secure Application Programming Interfaces (APIs) that allow for third party applications to easily plug into M-PESA. 

M-PESA has been very successful mainly because of its simplicity of use and device agnostic nature – works the same way for the latest iPhone as the good old Nokia phone that has been passed over several user generations. The API rides on the same concept, providing open interfaces over standard protocols through web services. Unlike the old system (G1) where a lot of workarounds had been done to automate payment experiences, developers can now hook directly to the core M-PESA and get creative with the systems they run. Let’s look at the payments use cases below.

   * **Automated Payment Receipt Processing:** Imagine the different scenarios that require customers to pay and have this processed instantly! Before G2, this was handled purely through Instant Payment Notification (IPN) which has served quite well. As the name indicates, IPN is only for notification processing. The use cases for payment processing are as many as your imagination can get – from utility bills to m/ecommerce, and the future is likely to get even more interesting.

   With the new system, the notifications are taken a notch higher by incorporating an optional payment validation step for Paybill. This allows the payment recipient (merchants) to confirm whether to accept the incoming payment or not. While this may not sound very beneficial at the face of it, think of how many customers send payments to the right Paybill number but enter the wrong account. Money moves from the customer's M-PESA account but their service payment will not be processed and they have to follow up. This has been creating a big problem with the merchants, leading to massive reversal requests. This can now be handled through the validation API which allows the recipient to validate any of the payment parameters, including, account, amount and even sender and only accept the payment if processing can be guaranteed.

   * **Automated Payment Disbursements:** Many systems that process receipts will also require outward payments processing. This could range from employees' salary disbursements to paying other merchants that accept M-PESA payments. This feature was only available via web portal for business to customers (B2C) with limitations on capacity that made it unsuitable for large disbursements. With the new platform, developers can have this done via API, which empowers them and cuts off the manual process of generating payments file, putting it in the right format then uploading it via the web portal, after which it has to be approved by a different user. With the B2C API, this is now seamless.

   * **Automated Payments Reversal:** Even with an elaborate system, there is always a unique case that calls for a reversal. Imagine a situation where a customer has made a payment for services that the merchant is no longer able to render. The best way to handle this would be to have a reversal process that the merchant can adapt based on their internal processes. G2 supports secure payment reversal automation for such cases. The implementation will fully depend on the service journey and controls required at the recipient's business.

Looking at the above use cases, one cannot fail to see the vast opportunity presented by the open interfaces. The future we once thought very distant of machine to machine payments is here and now. The only limitation to the adaption is the developer's imagination.

# Implementation of Safaricom API for Paybill and Buy Goods for Chamarika

This application interacts with the Safaficom [SOAP](http://www.w3.org/TR/soap) based Web Services described using [WSDL](http://www.w3.org/TR/wsdl) via a SSOAP connector.


## Background

When a customer initiates a Pay Bill service, the system will firstly authorize the transaction (reserve funds) and then sends a validation message to the bill issuer or merchant origination via a SOAP API. The transaction will only be successful when the third party validation is passed, otherwise it will be cancelled or be kept in “Authorized” status. 

When the transaction is successfully completed in the Mobile Money system, another confirmation message will also be sent to the third parties for real-time reconciliation. The confirmation request will be sent for both Buy goods and Paybill transactions.

A customer PayBill transaction can be initiated via STK or API channel. The transaction request will be sent the M-Pesa system for processing.

After the M-Pesa system authorizes the transaction, an external transaction validation request will be sent to 3rd Party system via Broker. The external transaction validation is optional.

If the correct response (the Result Code parameter from the third party value is 0) is received from the Broker, the Mobile Money system will complete the corresponding payment transaction. The transaction status will be changed to ‘Completed’.

If error response is replied by the Broker (the Result Code parameter from the third party value is not 0), the Mobile Money system will cancel the corresponding payment transaction. The transaction status will be changed to ‘Cancelled’.

The third party shall be registered in the broker, and must provide a callback URL for the Confirmation and the Validation and a default response when they are unreachable for the validation. This interface is described in the RegisterURL interface specification below.
After the validation, the M-Pesa system will complete the transaction. When the transaction is completed, besides SMS notifications will be sent to the Customer, a transaction confirmation message will also be sent to the Third Party system via Broker. The Third party system will capture the transactions from the confirmation message.

The confirmation message has no effect in the processing of the transaction.


## Safaricom VPN Information

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




## PayBill Transaction Validation Request from M-Pesa to Broker 

The C2BPaymentConfirmationResult message from Broker to M-Pesa is free text, no functional usage of this free text. It is only recorded in back-end log file in the M-Pesa system for traceability. 


Sample SOAP C2BPaymentValidationRequest xml Message

```
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

## PayBill Transaction Validation Result from Broker to M-Pesa

```
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

## PayBill Transaction Confirmation Request from M-Pesa to Broker 


```
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

## PayBill Transaction Confirmation Result from Broker to M-Pesa

```
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:c2b="http://cps.huawei.com/cpsinterface/c2bpayment">
   <soapenv:Header/>
   <soapenv:Body>
      <c2b:C2BPaymentConfirmationResult>C2B Payment Transaction 1234560000007031 result received.</c2b:C2BPaymentConfirmationResult>
   </soapenv:Body>
</soapenv:Envelope>

```



