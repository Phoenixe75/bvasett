'use client';
import TicketsListPage from './(shared-components)/tickets-list';

const TicketsPage = () => {
    return (
        <div className="grid">
            <div className="col-12">
                <div className="flex  align-items-center  justify-content-between m-2">
                    <div className="text-right">
                        <h5>لیست تیکت‌ها</h5>
                    </div>
                </div>
                <div>
                    <hr />
                    <TicketsListPage />
                </div>
            </div>
        </div>
    );
};

export default TicketsPage;
