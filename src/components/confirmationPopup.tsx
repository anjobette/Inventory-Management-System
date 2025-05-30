import React from "react";
import ReactDOM from "react-dom";

import "@/styles/popup.css";

interface ConfirmationPopupProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm?: () => void;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	variant?: "warning" | "success" | "error" | "info";
	showConfirmButton?: boolean;
	showCancelButton?: boolean;
}

export default function ConfirmationPopup({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = "Confirm",
	cancelText = "Cancel",
	variant = "info",
	showConfirmButton = true,
	showCancelButton = true
}: ConfirmationPopupProps) {
	if (!isOpen) return null;

	// Get variant-specific styles
	const getVariantClasses = () => {
		switch (variant) {
			case "success":
				return {
					icon: "success ri-checkbox-circle-line",
				};
			case "error":
				return {
					icon: "error ri-close-circle-line",
				};
			case "warning":
				return {
					icon: "warning ri-error-warning-line",
				};
			case "info":
			default:
				return {
					icon: "info ri-information-2-line",
				};
		}
	};

	const variantClasses = getVariantClasses();

	return ReactDOM.createPortal(
		<div className="popup-overlay">
			<div className="popup" onClick={(e) => e.stopPropagation()}>
				<div className="popup-heading">
					<i className={`popup-icon ${variantClasses.icon}`}></i>
					<h3 className="popup-title">{title}</h3>
				</div>

				<div className="popup-content">
					<p>{message}</p>
				</div>

				<div className="popup-actions">
					{showCancelButton && (
						<button
							className="cancel-btn"
							onClick={onClose}
						>
							{cancelText}
						</button>
					)}
					{showConfirmButton && onConfirm && (
						<button
							className="confirm-btn"
							onClick={() => {
								onConfirm();
								onClose();
							}}
						>
							{confirmText}
						</button>
					)}
				</div>
			</div>
		</div>,
		document.body
	);
}