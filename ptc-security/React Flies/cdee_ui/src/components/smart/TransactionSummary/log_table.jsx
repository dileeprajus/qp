/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { observer } from 'mobx-react';
import ReactTable from 'react-table';

const rawData = [
    {
        thingName: 'ThingName',
        primaryKey: 'String',
        updatedAt: 'DateTime',
        errorORInfo: JSON.stringify({}),
        thingType: '',
        templateName: 'ThingTemplateName',
        tag: 'TAGS',
        timeStamp: 'DATETIME'
    },{
        thingName: 'ThingName',
        primaryKey: 'String',
        updatedAt: 'DateTime',
        errorORInfo: JSON.stringify({}),
        thingType: '',
        templateName: 'ThingTemplateName',
        tag: 'SSSS',
        timeStamp: 'DATETIME'
    }
];

const requestData = (pageSize, page, sorted, filtered) => {
    return new Promise((resolve, reject) => {
        // You can retrieve your data however you want, in this case, we will just use some local data.
        let filteredData = rawData;

        // You can use the filters in your request, but you are responsible for applying them.
        if (filtered.length) {
            filteredData = filtered.reduce((filteredSoFar, nextFilter) => {
                return filteredSoFar.filter(row => {
                    return (row[nextFilter.id] + '').includes(nextFilter.value);
                });
            }, filteredData);
        }
        // You can also use the sorting in your request, but again, you are responsible for applying it.
        const sortedData = _.orderBy(
            filteredData,
            sorted.map(sort => {
                return row => {
                    if (row[sort.id] === null || row[sort.id] === undefined) {
                        return -Infinity;
                    }
                    return typeof row[sort.id] === 'string'
                        ? row[sort.id].toLowerCase()
                        : row[sort.id];
                };
            }),
            sorted.map(d => (d.desc ? 'desc' : 'asc'))
        );

        // You must return an object containing the rows of the current page, and optionally the total pages number.
        const res = {
            rows: sortedData.slice(pageSize * page, pageSize * page + pageSize),
            pages: Math.ceil(filteredData.length / pageSize)
        };
        setTimeout(() => resolve(res), 500);
    });
};

@observer
class LogTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            pages: null,
            loading: true
        };
        this.fetchData = this.fetchData.bind(this);
        this.columns = [
            {
                Header: 'Primary Key',
                accessor: 'primaryKey',
                id: 'primaryKey'
            },
            {
                Header: 'Type of module',
                accessor: 'thingType'
            },
            {
                Header: 'Config Name',
                accessor: 'thingName'
            },
            {
                Header: 'Group Name',
                accessor: 'templateName'
            },
            {
                Header: 'Tags',
                accessor: 'tag'
            },
            {
                Header: 'Updated At',
                accessor: 'updatedAt'
            },
            {
                Header: 'Time Stamp',
                accessor: 'timeStamp'
            },
            {
                columns: [
                    {
                        expander: true,
                        Header: () => <strong>More</strong>,
                        width: 65,
                        Expander: ({ isExpanded, ...rest }) =>
                            <div>
                                {isExpanded
                                    ? <span>&#x2299;</span>
                                    : <span>&#x2295;</span>}
                            </div>,
                        style: {
                            cursor: 'pointer',
                            fontSize: 25,
                            padding: '0',
                            textAlign: 'center',
                            userSelect: 'none'
                        }
                    }
                ]
            }
        ];
    }

    fetchData(state, instance) {
        // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
        // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
        this.setState({ loading: true });
        requestData(
            state.pageSize,
            state.page,
            state.sorted,
            state.filtered
        ).then(res => {
            this.setState({
                data: res.rows,
                pages: res.pages,
                loading: false
            });
        });
    }


    componenWillMount() {
    }

    render() {
        const { data, pages, loading } = this.state;
        return (
            <ReactTable
                columns={this.columns}
                manual
                data={data}
                pages={pages}
                loading={loading}
                onFetchData={this.fetchData}
                filterable
                minRows={1}
                defaultPageSize={10}
                className="-striped -highlight"
                SubComponent={() => <div style={{ padding: '10px' }}>Error Description.</div>}
            />
        );
    }
}

LogTable.propTypes = {
    store: React.PropTypes.object
};

export default LogTable;
