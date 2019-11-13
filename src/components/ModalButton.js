import React, { Component } from 'react';
import ModalTrigger from './ModalTrigger';
import PurchaseModal from './PurchaseModal';

class ModalButton extends Component {
    render() {
        return (
            <React.Fragment>
                <ModalTrigger triggerText={this.props.modalProps.triggerText} />
                <PurchaseModal />
            </React.Fragment>
        );
    }
}

export default ModalButton;
