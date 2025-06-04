import "@/styles/forms.css";

interface ViewBusModalProps {
    item: {
        id: number,
        bodyNumber: string,
        bodyBuilder: string,
        busType: string,
        busStatus: string,
        route: string,
        // Additional fields would be included in a real application
    };
    formatStatus: (status: string) => string;
    onClose: () => void;
}

export default function ViewBusModal({ item, formatStatus, onClose }: ViewBusModalProps) {
    return (
        <>
            <button className="close-modal-btn" onClick={onClose}>
                <i className="ri-close-line"></i>
            </button>

            <div className="modal-heading">
                <h1 className="modal-title">View Bus</h1>
            </div>

            <div className="modal-content view">
                <div className="view-order-form">
                    <div className="form-group">
                        <label>Route</label>
                        <p>{item.route}</p>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Plate Number</label>
                            <p>NGJ 4213</p>
                        </div>

                        <div className="form-group">
                            <label>Body Number</label>
                            <p>302508C</p>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Body Builder</label>
                            <p>Agila</p>
                        </div>

                        <div className="form-group">
                            <label>Bus Type</label>
                            <p>{item.busType}</p>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Manufacturer</label>
                            <p>Iveco</p>
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <p>{formatStatus(item.busStatus)}</p>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Chasis Number</label>
                            <p>PCMA1LJ04KS060128</p>
                        </div>

                        <div className="form-group">
                            <label>Engine Number</label>
                            <p>001642353</p>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Seat Capacity</label>
                            <p>45</p>
                        </div>

                        <div className="form-group">
                            <label>Purchase Price</label>
                            <p>Php 5,000,000.00</p>
                        </div>

                        <div className="form-group">
                            <label>Purchase Date</label>
                            <p>05/17/2017</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}