import { Injectable } from '@nestjs/common';
import fs from 'fs';
import { uploadDir } from 'src/common/utils/upload-dir';
import { SettingsService } from 'src/settings/services/settings.service';
import { User } from 'src/user/entities/user.entity';
import { Subscription } from '../entities/subscription.entity';
const path = require('path');
const PDFDocument = require('pdfkit');


interface InvoiceData {
    siteInfo: {
        logo: string
        name: string,
        email: string
        phone: string
        website: string
        address1: string
        address2: string
        state: string
    }
    userDetails: {
        name: string
        email: string
        address: string
    }
    subscriptionDetails: {
        planName: string
        invoiceId: string
        invoicePayAmount: number
        invoicePayCurrency: string
        invoiceDate: Date
        taxAmount: number
        baseAmount: number
        taxPercentage: number
        planPayStatus: string
        invoicePaymentMethod: string
        subscriptionAmount: number
    }
}


@Injectable()
export class InvoiceService {
    constructor(
        private readonly settingsService: SettingsService,
    ) { }

    async generateInvoice(subscriptions: Subscription, paymentId: string, userDetails: User) {
        const subscription = subscriptions.subscriptionDetails.find(detail => detail.payment.id === paymentId);
        const settings = await this.settingsService.getSettings();

        const defaultImagePath = path.join(__dirname, '../../../assets/images', 'invoice-logo.jpeg')
        const settingsLogoFullPath = path.join(uploadDir(), settings.logo || "")
        // check if the logo image path is working or not
        let logoImagePath = defaultImagePath;
        try {
            await fs.promises.access(settingsLogoFullPath, fs.constants.F_OK);
            logoImagePath = settingsLogoFullPath;
        } catch (error) {

        }

        const baseAmount = subscription.payment?.baseAmount || (subscription.subscriptionPlan.finalPrice * 100) - (subscription.payment?.taxAmount) || (subscription.subscriptionPlan.finalPrice * 100);

        const invoiceData: InvoiceData = {
            siteInfo: {
                logo: logoImagePath,
                name: "CtrlE Consulting & Holding GmbH",
                email: "sekretariat@meinjustus.de",
                phone: "+43 660 5810753",
                website: "https://www.meinjustus.de",
                address1: "Leitnerberg 14a",
                address2: "4490 St. Florian",
                state: "Österreich (Austria)"
            },
            userDetails: {
                name: userDetails.fullName,
                email: userDetails.email,
                address: userDetails.address,
            },
            subscriptionDetails: {
                planName: subscription.subscriptionPlan.name as string,
                invoiceId: `MJ-${subscription.payment.created}`,
                invoicePayAmount: subscription.payment.amount,
                taxAmount: subscription.payment?.taxAmount || 0,
                baseAmount: baseAmount,
                subscriptionAmount: subscription.subscriptionPlan.finalPrice,
                invoicePayCurrency: subscription.payment.currency,
                invoicePaymentMethod: subscription.payment.payment_method_types[0],
                taxPercentage: subscription.payment?.taxPercentage || 0,
                invoiceDate: new Date(subscription.startDate),
                planPayStatus: subscription.payment.status,
            }
        };

        const doc = new PDFDocument({
            margin: 50,
            size: 'A4',
            info: {
                Title: 'Zahlungsrechnung',
                Author: 'Automatisch generiert',
            }
        });

        // Add watermark to each page
        doc.on('pageAdded', () => {
            const pageWidth = doc.page.width;
            const pageHeight = doc.page.height;

            doc.save()
                .rotate(45, { origin: [pageWidth / 2, pageHeight / 2] })
                .image(invoiceData.siteInfo.logo, pageWidth / 2 - 150, pageHeight / 2 - 150, {
                    width: 300,
                    height: 300,
                    opacity: 0.1
                })
                .restore();
        });

        this.generateHeader(doc, invoiceData)
        this.generateCustomerInformation(doc, invoiceData)
        this.generateInvoiceTable(doc, invoiceData)
        this.generateFooter(doc, invoiceData)
        doc.end();

        // Create a buffer to store the PDF
        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));

        return new Promise<Buffer>((resolve) => {
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(chunks);
                resolve(pdfBuffer);
            });
        });

    }

    private generateHeader(doc, invoiceData: InvoiceData) {
        doc
            .image(invoiceData.siteInfo.logo, 50, 45, { width: 50 })
            .fillColor("#444444")
            .fontSize(15)
            .text(invoiceData.siteInfo.name, 110, 57)
            .fontSize(10)
            .text(invoiceData.siteInfo.address1, 200, 50, { align: "right" })
            .text(invoiceData.siteInfo.address2, 200, 65, { align: "right" })
            .text(invoiceData.siteInfo.state, 200, 80, { align: "right" })
            .moveDown();
    }

    private generateCustomerInformation(doc, invoiceData: InvoiceData) {
        doc
            .fillColor("#444444")
            .fontSize(20)
            .text("Rechnung", 50, 160);

        this.generateHr(doc, 185);

        const customerInformationTop = 200;

        doc
            .fontSize(10)
            .text("Name:", 50, customerInformationTop)
            .text(invoiceData.userDetails.name, 150, customerInformationTop)
            .text("Email:", 50, customerInformationTop + 15)
            .text(invoiceData.userDetails.email, 150, customerInformationTop + 15)
            .text("Adresse:", 50, customerInformationTop + 30)
            .text(invoiceData.userDetails.address, 150, customerInformationTop + 30, {
                width: 140,
                align: 'left'
            })
            .text("Rechnungsnummer:", 300, customerInformationTop)
            .text(invoiceData.subscriptionDetails.invoiceId, 400, customerInformationTop)
            .text("Rechnungsdatum:", 300, customerInformationTop + 15)
            .text(this.formatDate(invoiceData.subscriptionDetails.invoiceDate), 400, customerInformationTop + 15)
            .text("Rechnungsbetrag:", 300, customerInformationTop + 30)
            .text(
                this.formatCurrency(invoiceData.subscriptionDetails.invoicePayAmount),
                400,
                customerInformationTop + 30
            )
            .text("Zahlungsweise:", 300, customerInformationTop + 45)
            .text(invoiceData.subscriptionDetails.invoicePaymentMethod, 400, customerInformationTop + 45)
            .moveDown();

        this.generateHr(doc, 300);
    } private generateInvoiceTable(doc, invoiceData: InvoiceData) {
        let i;
        const invoiceTableTop = 330;

        doc.font("Helvetica-Bold");
        this.generateTableRow(
            doc,
            invoiceTableTop,
            "Bezeichnung",
            "Menge",
            "Einheit",
            "Einzelpreis",
            "Gesamtpreis"
        );
        this.generateHr(doc, invoiceTableTop + 20);
        doc.font("Helvetica");

        for (i = 0; i < 1; i++) {
            const position = invoiceTableTop + (i + 1) * 30;
            this.generateTableRow(
                doc,
                position,
                invoiceData.subscriptionDetails.planName,
                "1",
                "Abo",
                this.formatCurrency(invoiceData.subscriptionDetails.baseAmount),
                this.formatCurrency(invoiceData.subscriptionDetails.baseAmount)
            );

            this.generateHr(doc, position + 20);
        }

        const subtotalPosition = invoiceTableTop + (i + 1) * 30;
        this.generateTableRow(
            doc,
            subtotalPosition,
            "",
            "",
            "Nettobetrag",
            "",
            this.formatCurrency(invoiceData.subscriptionDetails.baseAmount)
        );

        const paidToDatePosition = subtotalPosition + 20;
        this.generateTableRow(
            doc,
            paidToDatePosition,
            "",
            "",
            "Umsatzsteuer " + invoiceData.subscriptionDetails.taxPercentage + "%",
            "",
            this.formatCurrency(invoiceData.subscriptionDetails.taxAmount)
        );

        const duePosition = paidToDatePosition + 25;
        doc.font("Helvetica-Bold");
        this.generateTableRow(
            doc,
            duePosition,
            "",
            "",
            "Rechnungsbetrag",
            "",
            this.formatCurrency(invoiceData.subscriptionDetails.invoicePayAmount)
        );
        doc.font("Helvetica");
    }

    private generateFooter(doc, invoiceData: InvoiceData) {
        doc
            .fontSize(10)
            .text(
                `Tel.: ${invoiceData.siteInfo.phone}\nE-Mail: ${invoiceData.siteInfo.email}\nWebsite: ${invoiceData.siteInfo.website}`,
                50,
                735,
                { align: "left", width: 500 }
            ).moveDown();
        this.generateHr(doc, 775);

        doc.text(
            "Vielen Dank, dass Sie bei uns sind.",
            50,
            780,
            { align: "center", width: 500 }
        );
    }

    private generateTableRow(
        doc,
        y,
        item,
        description,
        unitCost,
        quantity,
        lineTotal
    ) {
        doc
            .fontSize(10)
            .text(item, 50, y)
            .text(description, 150, y)
            .text(unitCost, 280, y, { width: 90, align: "right" })
            .text(quantity, 370, y, { width: 90, align: "right" })
            .text(lineTotal, 0, y, { align: "right" });
    }

    private generateHr(doc, y) {
        doc
            .strokeColor("#aaaaaa")
            .lineWidth(1)
            .moveTo(50, y)
            .lineTo(550, y)
            .stroke();
    }

    private formatDate(date) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return year + "/" + month + "/" + day;
    }

    private formatCurrency(cents, isCents = true) {
        if (isCents) {
            cents = cents / 100;
            return "€" + cents.toFixed(2);
        }
        return "€" + cents.toFixed(2);
    }
}