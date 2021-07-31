import moment from 'moment'
import { humanize } from '../utils/index';
// const customerColumns = [
//     {
//         title: "Customer",
//         dataIndex: "customer",
//         key: 'customer'
//     },
//     {
//         title: "Total Revenue Impact",
//         dataIndex: "revenue_impact",
//         key: 'revenue_impact'
//     }
// ]

// const activityIdColumns = [
//     {
//         title: "ActivityId",
//         dataIndex: "activity_id",
//     },
//     {
//         title: "Customer",
//         dataIndex: 'customer'
//     },
//     {
//         title: "Revenue Impact",
//         dataIndex: 'revenue_impact'
//     }
// ]

// const sourceColumns = [
//     {
//         title: "Source",
//         dataIndex: "source",
//     },
//     {
//         title: "Revenue_impact",
//         dataIndex: "sum"
//     }
// ]

// const customerColumns = [
//     {
//         title: "Customer",
//         dataIndex: "customer",
//     }, 

//     {
//         title: "Revenue_Impact",
//         dataIndex: "revenue_impact"
//     }
// ]

// const customerColumns = [
//     {
//         title: "Customer",
//         dataIndex: "customer",
//     },
//     {
//         title: "Revenue_Impact",
//         dataIndex: "revenue_impact"
//     }
// ]

// const timestampColumns = [
//     {
//         title: "Timestamp",
//         dataIndex: "ts",
//     },
//     {
//         title: "Customer",
//         dataIndex: "customer"
//     },
//     {
//         title: "Revenue_Impact",
//         dataIndex: "revenue_impact"
//     }
// ]


// const activityColumns = [
//     {
//         title: "Activity",
//         dataIndex: "activity",
//     },
//     {
//         title: "Revenue_Impact",
//         dataIndex: "revenue_impact"
//     }
// ]

// const feature1Columns = [
//     {
//         title: "Feature1",
//         dataIndex: "feature_1",
//     },
//     {
//         title: "Revenue_Impact",
//         dataIndex: "revenue_impact"
//     }
// ]

// const feature2Columns = [
//     {
//         title: "Feature2",
//         dataIndex: "feature_2",
//     },
//     {
//         title: "Revenue_Impact",
//         dataIndex: "revenue_impact"
//     }
// ]

// const feature3Columns = [
//     {
//         title: "Feature3",
//         dataIndex: "feature_3",
//     },
//     {
//         title: "Revenue_Impact",
//         dataIndex: "revenue_impact"
//     }
// ]

// const revenueImpactColumns = [
//     {
//         title: "Revenue Impact",
//         dataIndex: "revenue_impact",
//     },
//     {
//         title: "Revenue_Impact",
//         dataIndex: "revenue_impact"
//     }
// ]

// const linkColumns = [
//     {
//         title: "Link",
//         dataIndex: "link",
//     },
//     {
//         title: "Revenue_Impact",
//         dataIndex: "revenue_impact"
//     }
// ]

 export const group_by_columns = {
    group_by_activityid: [
        {
            title: "ActivityId",
            dataIndex: "activity_id",
            key: "activity_id"
        },
        {
            title: "Customer",
            dataIndex: 'customer',
            key: "customer"
        },
        {
            title: "Total Revenue Impact",
            dataIndex: 'sum',
            key: "sum"
        }
    ],

    group_by_customer: [
        {
            title: "Customer",
            dataIndex: "customer",
            key: 'customer'
        },
        {
            title: "Total Revenue Impact",
            dataIndex: "sum",
            key: 'sum'
        }
    ],

    group_by_timestamp: [
        {
            title: "Timestamp",
            dataIndex: "ts",
            render: (ts) => moment(ts).format('ll'),
            key: "ts"
        },
        {
            title: "Customer",
            dataIndex: "customer",
            key: "customer"
        },

        {
            title: "Activity",
            dataIndex: "activity",
            render: (activity) => humanize(activity || ''),
            key: "activity"
        },
        {
            title: "Revenue_Impact",
            dataIndex: "sum",
            key: "sum"
        }
    ],

    group_by_source: [
        {
            title: "Source",
            dataIndex: "source",
            key: "source"
        },
        {
            title: " Total Revenue_impact",
            dataIndex: "sum",
            key: "sum"
        }
    ],

    group_by_sourceid: [
        {
            title: "SourceId",
            dataIndex: "source_id",
            key: "source_id"
        },
        {
            title: "Total Revenue_impact",
            dataIndex: "sum",
            key: "sum"
        }
    ],

    group_by_activity: [
        {
            title: "Activity",
            dataIndex: "activity",
            key: "activity"
        },
        {
            title: "Total Revenue_Impact",
            dataIndex: "sum",
        }
    ],

    group_by_feature1: [
        {
            title: "Feature1",
            dataIndex: "feature_1",
            key: "feature_1"
        },
        {
            title: "Total Revenue_Impact",
            dataIndex: "sum",
            key: "sum"
        }
    ],

    group_by_feature2: [
        {
            title: "Feature2",
            dataIndex: "feature_2",
        },
        {
            title: "Total Revenue_Impact",
            dataIndex: "sum"
        }
    ],

    group_by_feature3: [
        {
            title: "Feature3",
            dataIndex: "feature_3",
        },
        {
            title: "Total Revenue_Impact",
            dataIndex: "sum"
        }
    ],

    group_by_revenue_impact: [
        {
            title: "ActivityId",
            dataIndex: "activity_id",
        },
        {
            title: "Customer",
            dataIndex: "customer",
        },
        {
            title: "Total Revenue Impact",
            dataIndex: "revenue_impact"
        }
    ],
    group_by_link: [
        {
            title: "Link",
            dataIndex: "link",
        },
        {
            title: "Total Revenue Impact",
            dataIndex: "sum"
        }
    ],
    group_by_occurence: [
        {
            title: "ActivityId",
            dataIndex: "activity_id",
        },
        {
            title: "Customer",
            dataIndex: "customer",
        },

        {
            title: "Occurence",
            dataIndex: "occurence",
        },
        {
            title: "Total Revenue Impact",
            dataIndex: "sum"
        }
    ],
    group_by_activity_repeated_at: [
        {
            title: "ActivityId",
            dataIndex: "activity_id",
        }, 
        {
            title: "Activity Repeated at",
            render: (activity_repeated_at) => moment(activity_repeated_at).format('ll'),
            dataIndex: "activity_repeated_at",
        },
        {
            title: "Customer",
            dataIndex: "customer",
        },
        {
            title: "Total Revenue Impact",
            dataIndex: "sum"
        }
    ]
}