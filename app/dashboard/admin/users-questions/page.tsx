'use client';
import React from 'react';
import QuestionsList from './(shared-components)/questions-list';

const QuestionsPage = () => {
    return (
        <div className="grid">
            <div className="col-12">
                <div className="flex  align-items-center  justify-content-between m-2">
                    <div className="text-right">
                        <h5>لیست سوالات</h5>
                    </div>
                </div>
                <div>
                    <hr />
                    <QuestionsList />
                </div>
            </div>
        </div>
    );
};

export default QuestionsPage;
