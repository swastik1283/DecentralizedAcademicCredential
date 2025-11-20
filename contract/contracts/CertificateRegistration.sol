
//SPDX-License-Identifier:MIT
pragma solidity ^0.8.20;

contract CertificateRegistration{
    struct CertificateData{
        address issuer;
        uint256 timestamp;
        bool exists;
    }

    mapping(string=>CertificateData) public certificate;

    event CertificateStored(
        string indexed hash,
        address indexed issuer,
        uint256 timestamp
    );


    function storeCertificate(string memory hash) public{
        require(!certificate[hash].exists,"certificate already stored");

        certificate[hash]=CertificateData({
            issuer:msg.sender,
            timestamp:block.timestamp,
            exists:true
        });

        emit CertificateStored(hash, msg.sender, block.timestamp);
    }
    function verifyCertificate(string memory hash ) public view returns (bool exists,address issuer, uint256 timestamp)
    {
        CertificateData memory cert=certificate[hash];
        return (cert.exists,cert.issuer,cert.timestamp);
    }
}

