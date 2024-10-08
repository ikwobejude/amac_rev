
const Sequelize = require('sequelize');
const db = require('../db/db');

module.exports = {
    Api_Payments: db.define('api_payments',{
        idapi_payments:{
            type: Sequelize.INTEGER(11),
            autoIncrement: true,
            primaryKey: true,
            allowNull : true
        },
        service_id:{
            type: Sequelize.STRING(45)
        },
        PaymentLogId:{
            type: Sequelize.STRING(200)
        },
        CustReference:{
            type: Sequelize.STRING(200)
        },
        AlternateCustReference:{
            type: Sequelize.STRING(200)
        },
        Amount:{
            type: Sequelize.DECIMAL(50),
            decimals: 2
        },
        PaymentMethod:{
            type: Sequelize.STRING(45)
        },
        PaymentReference:{
            type: Sequelize.STRING(100)
        },
        TerminalId:{
            type: Sequelize.STRING(45)
        },
        ChannelName:{
            type: Sequelize.STRING(45)
        },
        Location:{
            type: Sequelize.STRING(45)
        },
        PaymentDate:{
            type: Sequelize.DATE,
            allowNull : true
        },
        InstitutionId:{
            type: Sequelize.STRING(200) 
        },
        InstitutionName:{
            type: Sequelize.STRING(200) 
        },
        BranchName:{
            type: Sequelize.STRING(50) 
        },
        BankName:{
            type: Sequelize.STRING(50) 
        },
        CustomerName:{
            type: Sequelize.STRING(200) 
        },
        OtherCustomerInfo:{
            type: Sequelize.STRING(200) 
        },
        ReceiptNo:{
            type: Sequelize.STRING(45) 
        },
        CollectionsAccount:{
            type: Sequelize.STRING(45) 
        },
        BankCode:{
            type: Sequelize.STRING(45) 
        },
        CustomerAddress:{
            type: Sequelize.STRING(200) 
        },
        CustomerPhoneNumber:{
            type: Sequelize.STRING(45) 
        },
        DepositorName:{
            type: Sequelize.STRING(200) 
        },
        DepositSlipNumber:{
            type: Sequelize.STRING(45) 
        },
        PaymentCurrency:{
            type: Sequelize.STRING(45) 
        },
        IsReversal:{
            type: Sequelize.STRING(45) 
        },
        ItemName:{
            type: Sequelize.STRING(200) 
        },
        ItemCode:{
            type: Sequelize.STRING(45) 
        },
        ItemAmount:{
            type: Sequelize.DECIMAL(50),
            decimals: 2
        },
        locked:{
            type: Sequelize.TINYINT(1)
        },
        revenue_id:{
            type: Sequelize.INTEGER(11)
        },
        invoice_no:{
            type: Sequelize.STRING
        },
        ServiceUrl:{
            type: Sequelize.STRING
        },
        ServiceUsername:{
            type: Sequelize.STRING
        },
        ServicePassword:{
            type: Sequelize.STRING
        },
        FtpUrl:{
            type: Sequelize.STRING
        },
        FtpUsername:{
            type: Sequelize.STRING
        },
        FtpPassword:{
            type: Sequelize.STRING
        },
        IsRepeated:{
            type: Sequelize.STRING
        },
        ProductGroupCode:{
            type: Sequelize.STRING
        },
        SettlementDate:{
            type: Sequelize.STRING
        },
        BranchNam:{
            type: Sequelize.STRING
        },
        ThirdPartyCode:{
            type: Sequelize.STRING
        },
        LeadBankCode:{
            type: Sequelize.STRING
        },
        LeadBankCbnCode:{
            type: Sequelize.STRING
        },
        CategoryCode:{
            type: Sequelize.STRING
        },
        ItemQuantity:{
            type: Sequelize.STRING
        },
        OriginalPaymentLogId:{
            type: Sequelize.STRING
        },
        OriginalPaymentReference:{
            type: Sequelize.STRING
        },
        Teller:{
            type: Sequelize.STRING
        },
        synch_status:{
            type: Sequelize.TINYINT(1),
            allowNull: true
        },
        found_taxpayer:{
            type: Sequelize.STRING
        },
        found_invoice:{
            type: Sequelize.STRING
        },
        settled:{
            type: Sequelize.STRING
        },
        logged_date:{
            type: Sequelize.DATE
        },
        service_charge:{
            type: Sequelize.DECIMAL(50),
            decimals: 2,
            allowNull: true
        },
        amount_net:{
            type: Sequelize.DECIMAL(50),
            decimals: 2,
            allowNull: true
        },
        sources:{
            type: Sequelize.STRING
        },
        taxpayer_rin:{
            type: Sequelize.STRING
        }
    },{
        timestamps : false,
        freezeTableName: true,
    }),
    
    Payer_balances: db.define('payer_balances', {
        idpayer_balance:{
            type: Sequelize.INTEGER(11),
            autoIncrement: true,
            primaryKey: true,
            allowNull : true
        },
        tax_id:{
            type: Sequelize.STRING(45),
            allowNull : true
        },
        account:{
            type: Sequelize.STRING(45),
            allowNull : true
        },
        balance:{
            type: Sequelize.DECIMAL(250),
            decimals: 2,
            allowNull : true
        },
        mobile_wallet_balance:{
            type: Sequelize.DECIMAL(250),
            decimals: 2,
            allowNull : true
        },
        last_update: {
            type: Sequelize.DATE
        },
        last_update_description:{
            type: Sequelize.STRING(250),
            allowNull : true
        },
        service_id:{
            type: Sequelize.STRING(45),
            allowNull : true
        },
        organization_id:{
            type: Sequelize.STRING(45),
            allowNull : true
        },
        registered_by:{
            type: Sequelize.STRING(55),
            allowNull : true
        },
        registered_on: {
            type: Sequelize.DATE
        }
    },{
        timestamps : false,
        freezeTableName: true,
    }),

    api_payment_notification: db.define('api_payment_notification', {
        id:{
            type: Sequelize.INTEGER(11),
            autoIncrement: true,
            primaryKey: true,
            allowNull : true
        },
        invoice_number:{type: Sequelize.STRING(45)},
        reference_number:{type: Sequelize.TEXT},
        callback_url:{type: Sequelize.TEXT},
        amount:{type: Sequelize.DECIMAL(50)},
        payment_acknowledged_on:{type: Sequelize.DATE},
        notification_sent_on:{type: Sequelize.DATE},
        third_party_acknowledged_on:{type: Sequelize.DATE},
        acknowledged_status:{type: Sequelize.STRING(45)},
        isRepeat:{type: Sequelize.STRING(45)},
        payload:{type: Sequelize.STRING(45)},
    },{
        timestamps : false,
        freezeTableName: true,
    })
}


// module.exports = {Api_Payments}