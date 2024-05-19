import React from 'react';
import Highlight from 'src/components/Highlight';
import Payment from 'src/components/Payment';

function Content() {
    return (
        <section>
            <div className="container">
                <div className="row">
                    <Payment />
                    <Highlight />
                </div>
            </div>
        </section>
    );
}

export default Content;
