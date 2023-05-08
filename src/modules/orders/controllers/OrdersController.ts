import { Request, Response } from 'express';
import CreateOrderService from '../services/CreateOrderService';
import ShowOrderService from '../services/ShowOrderService';
import auth from '@config/auth';
import ListOrdersService from '../services/ListOrdersService';
import UpdateOrderService from '../services/UpdateOrderService';

const jwt = require('jsonwebtoken');

export default class OrdersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listOrders = new ListOrdersService();

    const orders = await listOrders.execute();

    return response.json(orders);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const authHeader = request.headers.authorization;

    const [, token] = authHeader.split(' ');

    const decodedToken = jwt.verify(token, auth.jwt.secret);

    const customer = decodedToken.sub;

    const showOrder = new ShowOrderService();

    const order = await showOrder.list({ customer });

    return response.json(order);
  }

  public async show_status_history(request: Request, response: Response): Promise<Response> {
    const authHeader = request.headers.authorization;

    const [, token] = authHeader.split(' ');

    const decodedToken = jwt.verify(token, auth.jwt.secret);

    const customer = decodedToken.sub;

    const showOrder = new ShowOrderService();

    const order = await showOrder.list_status_history({ customer });

    return response.json(order);
  }

  public async show_status_ongoing(request: Request, response: Response): Promise<Response> {
    const authHeader = request.headers.authorization;

    const [, token] = authHeader.split(' ');

    const decodedToken = jwt.verify(token, auth.jwt.secret);

    const customer = decodedToken.sub;

    const showOrder = new ShowOrderService();

    const order = await showOrder.list_status_ongoing({ customer });

    return response.json(order);
  }



  public async create(request: Request, response: Response): Promise<Response> {
    const { customer_id, products, address_id, order_status, payment_method } = request.body;

    const createOrder = new CreateOrderService();

    const order = await createOrder.execute({
      customer_id,
      products,
      address_id,
      order_status,
      payment_method,
    });

    return response.json(order);
  }

  public async updateStatus(request: Request, response: Response): Promise<Response> {
    const { order_status, payment_method } = request.body;
    const authHeader = request.headers.authorization;

    const [, token] = authHeader.split(' ');

    const decodedToken = jwt.verify(token, auth.jwt.secret);

    const customer = decodedToken.sub;

    const update = new UpdateStatusService();

    const order = await update.updateStatus({
      customer,
      order_status,
    });

    return response.json(order);
  }
}
