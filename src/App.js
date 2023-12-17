import React from 'react';
import Header from './components/Header';
import TableUsers from './components/TableUsers';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';

function App() {
    return (
        <div className="app-container">
            <Container>
                <Header />
                <TableUsers />
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </Container>
        </div>
    );
}

export default App;
