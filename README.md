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

   **Supplier:** Cisco

   **Type:** ASA 5540

   **Model**

   **OS**

   **Peer Address:** 196.201.212.240

   **Test Peer Address**

   **Proposal Name:** IKE-3DES-SHA

   **Authenticated Mode** : Pre-shared Key

   **Preshared Key:** To be shared later

   **Authentification Algorithm:** SHA

   **Encrytion Algorithm:** 3DES-168

   **Diffie-Hellman Group:** Group 2(1024 bits)

   **Lifetime Measurement:** Time

   **Lifetime:** 86400


   **Authentification Algorithm:** ESP/SHA

   **Encryption LLgorithm:** AES-128

   **Encapsulation Mode:** ESP Tunnel

   **Perfect Forwaard Secrecy:** Disabled

   **Lifetime Measurement:** Time

   **Lifetime:** 3600

   * **Network Servers**
      *196.201.214.136
      *196.201.214.137
      *196.201.214.127
      *196.201.214.145
      *196.201.214.144
      *196.201.214.94
      *196.201.214.95

   **Port Numbers:**
   8310 
   18323
   18423
   80
   8080




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



