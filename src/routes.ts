import express, { Request, Response } from 'express';
import { OrderSummary } from './models/orderSummary';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const OrderSummaryRouter = express.Router();

export interface OrderSummaryCreateReq extends Request {
  body: {
    orderId: string;
    customerName: string;
    customerAddress: string;
    deliveryService: string;
    orderItems: {
      name: string;
      price: number;
      quantity: number;
    }[];
  };
}

OrderSummaryRouter.get(
  '/orderSummary/:orderId',
  async (req: Request & { params: { orderId: string } }, res: Response) => {
    const { orderId } = req.params;
    const orderSummary = await OrderSummary.findOne({ orderId });
    if (!orderSummary) {
      return res.status(404).json({
        error: 'orderSummary_not_found',
        error_description: 'OrderSummary Tidak Ditemukan',
      });
    }
    return res.json({ data: orderSummary });
  }
);

OrderSummaryRouter.post(
  '/orderSummary',
  async (req: OrderSummaryCreateReq, res: Response) => {
    try {
      const {
        orderItems,
        orderId,
        customerName,
        customerAddress,
        deliveryService,
      } = req.body;

      const totalPrice = orderItems.reduce((prev, cur) => prev + cur.price, 0);

      const doc = new jsPDF();

      doc.setFontSize(20);
      doc.text('Order Summary', 105, 10, { align: 'center' });

      doc.setFontSize(10);
      doc.text(`Customer: ${customerName}`, 10, 20);
      doc.text(`Address: ${customerAddress}`, 10, 25);
      doc.text('Delivery Service: ' + String(deliveryService), 10, 30);

      autoTable(doc, {
        startY: 40,
        head: [['Name', 'Price', 'Quantity']],
        body: orderItems.map(val => [
          String(val.name),
          String(val.price),
          String(val.quantity),
        ]),
      });

      const finalY = (doc as any).lastAutoTable?.finalY;

      // doc.text('Delivery Cost: Rp2', 180, finalY + 5, {
      //   align: 'right',
      // });
      doc.text(`Total Cost: Rp${totalPrice}`, 180, finalY + 10, {
        align: 'right',
      });

      const filename = `summary_${orderId}.pdf`;
      doc.save(`./file/${filename}`);
      const data = await OrderSummary.create({
        orderId,
        downloadLink: `orderSummary/file/${filename}`,
      });
      return res.status(201).json({ data });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: 'invalid_request',
        error_description: 'ada kesalahan',
      });
    }
  }
);

OrderSummaryRouter.delete(
  '/orderSummary/:id',
  async (req: Request & { params: { orderId: string } }, res: Response) => {
    const { orderId } = req.params;
    const orderSummary = await OrderSummary.findByIdAndDelete(orderId);
    if (!orderSummary) {
      return res.status(404).json({
        error: 'orderSummary_not_found',
        error_description: 'OrderSummary Tidak Ditemukan',
      });
    }
    return res.status(200).json({
      message: 'orderSummary Deleted',
      item: orderSummary.toJSON(),
    });
  }
);

export default OrderSummaryRouter;
