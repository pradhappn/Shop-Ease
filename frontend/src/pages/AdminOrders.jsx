// Admin order dashboard for reviewing customer orders and changing fulfillment status.
import { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';
import { formatPrice } from '../utils/currency';
import './AdminOrders.css';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch recent orders for the management table when the page opens.
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        // Retrieve all orders available to the administrator.
        try {
            const response = await ordersAPI.getAllAdmin();
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        // Save a new fulfillment state, then reload rows to reflect server data.
        try {
            await ordersAPI.updateStatus(orderId, newStatus);
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const getStatusBadge = (status) => {
        // Map each order status to the visual badge style used by the table.
        const badges = {
            pending: 'badge-warning',
            processing: 'badge',
            shipped: 'badge-secondary',
            delivered: 'badge-success',
            cancelled: 'badge-error'
        };
        return badges[status] || 'badge';
    };

    if (loading) {
        return (
            <div className="admin-orders-page">
                <div className="container">
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-orders-page">
            <div className="container">
                <h1 className="page-title">Order Management</h1>

                {/* Tabular order data includes a control for updating each status. */}
                <div className="orders-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td className="order-id">{order._id.slice(-8)}</td>
                                    <td>{order.user?.name || 'N/A'}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>{formatPrice(order.totalAmount)}</td>
                                    <td>
                                        <span className={`badge ${getStatusBadge(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className="status-select"
                                            value={order.status}
                                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {orders.length === 0 && (
                        <div className="no-orders">
                            <p>No orders found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
