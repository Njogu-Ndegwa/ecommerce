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
            key: "id"
        },
        {
            title: "Total Revenue Impact",
            dataIndex: 'sum',
            key: "sum"
        },
        {
            title: "Total Completed Orders Rows",
            dataIndex: 'total_primary_activity',
            key: "total_primary_activity"
        },
        {
            title: "Total Completed Activity Rows",
            dataIndex: 'total_secondary_activity',
            key: "total_secondary_activity"
        },
        {
            title: "Conversion rate to completed activities",
            dataIndex: 'conversion_rate',
            key: "conversion_rate"
        },
        {
            title: "Average days from completed activity",
            dataIndex: 'average_days',
            key: "average_days"
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
        },
        {
            title: "Total Completed orders Rows",
            dataIndex: 'total_primary_activity',
            key: "total_primary_activity"
        },
        {
            title: "Total Completed Activity Rows",
            dataIndex: 'total_secondary_activity',
            key: "total_secondary_activity"
        },
        {
            title: "Conversion rate to completed activities",
            dataIndex: 'conversion_rate',
            key: "conversion_rate"
        },
        {
            title: "Average days from completed activity",
            dataIndex: 'average_days',
            key: "average_days"
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
            title: " Total Revenue_impact",
            dataIndex: "sum",
            key: "sum"
        },
        {
            title: "Total Completed Orders Rows",
            dataIndex: 'total_primary_activity',
            key: "total_primary_activity"
        },
        {
            title: "Total Completed Activity Rows",
            dataIndex: 'total_secondary_activity',
            key: "total_secondary_activity"
        },
        {
            title: "Conversion rate to completed activities",
            dataIndex: 'conversion_rate',
            key: "conversion_rate"
        },
        {
            title: "Average days from completed activity",
            dataIndex: 'average_days',
            key: "average_days"
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
        },
        {
            title: "Total Completed Orders Rows",
            dataIndex: 'total_primary_activity',
            key: "total_primary_activity"
        },
        {
            title: "Total Completed Activity Rows",
            dataIndex: 'total_secondary_activity',
            key: "total_secondary_activity"
        },
        {
            title: "Conversion rate to completed activities",
            dataIndex: 'conversion_rate',
            key: "conversion_rate"
        },
        {
            title: "Average days from completed activity",
            dataIndex: 'average_days',
            key: "average_days"
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
        },
        {
            title: "Total Completed order Rows",
            dataIndex: 'total_primary_activity',
            key: "total_primary_activity"
        },
        {
            title: "Total Completed Activity Rows",
            dataIndex: 'total_secondary_activity',
            key: "total_secondary_activity"
        },
        {
            title: "Conversion rate to completed activities",
            dataIndex: 'conversion_rate',
            key: "conversion_rate"
        },
        {
            title: "Average days from completed activity",
            dataIndex: 'average_days',
            key: "average_days"
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
        },
        {
            title: "Total Completed order Rows",
            dataIndex: 'total_primary_activity',
            key: "total_primary_activity"
        },
        {
            title: "Total Completed Activity Rows",
            dataIndex: 'total_secondary_activity',
            key: "total_secondary_activity"
        },
        {
            title: "Conversion rate to completed activities",
            dataIndex: 'conversion_rate',
            key: "conversion_rate"
        },
        {
            title: "Average days from completed activity",
            dataIndex: 'average_days',
            key: "average_days"
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
        },
        {
            title: "Total Completed order Rows",
            dataIndex: 'total_primary_activity',
            key: "total_primary_activity"
        },
        {
            title: "Total Completed Activity Rows",
            dataIndex: 'total_secondary_activity',
            key: "total_secondary_activity"
        },
        {
            title: "Conversion rate to completed activities",
            dataIndex: 'conversion_rate',
            key: "conversion_rate"
        },
        {
            title: "Average days from completed activity",
            dataIndex: 'average_days',
            key: "average_days"
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
        },
        {
            title: "Total Completed order Rows",
            dataIndex: 'total_primary_activity',
            key: "total_primary_activity"
        },
        {
            title: "Total Completed Activity Rows",
            dataIndex: 'total_secondary_activity',
            key: "total_secondary_activity"
        },
        {
            title: "Conversion rate to completed activities",
            dataIndex: 'conversion_rate',
            key: "conversion_rate"
        },
        {
            title: "Average days from completed activity",
            dataIndex: 'average_days',
            key: "average_days"
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
        },
        {
            title: "Total Completed order Rows",
            dataIndex: 'total_primary_activity',
            key: "total_primary_activity"
        },
        {
            title: "Total Completed Activity Rows",
            dataIndex: 'total_secondary_activity',
            key: "total_secondary_activity"
        },
        {
            title: "Conversion rate to completed activities",
            dataIndex: 'conversion_rate',
            key: "conversion_rate"
        },
        {
            title: "Average days from completed activity",
            dataIndex: 'average_days',
            key: "average_days"
        }
    ],

    group_by_revenue_impact: [
        {
            title: "Total Revenue Impact",
            dataIndex: "revenue_impact"
        },
        {
            title: "Total Revenue Impact rows",
            dataIndex: "revenue_impact"
        },
        {
            title: "Total Completed order Rows",
            dataIndex: 'total_secondary_activity',
            key: "total_secondary_activity"
        },
        {
            title: "Conversion rate to completed activities",
            dataIndex: 'conversion_rate',
            key: "conversion_rate"
        },
        {
            title: "Average days from completed activity",
            dataIndex: 'average_days',
            key: "average_days"
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
        },
        {
            title: "Total Completed order Rows",
            dataIndex: 'total_primary_activity',
            key: "total_primary_activity"
        },
        {
            title: "Total Completed Order Rows",
            dataIndex: 'total_secondary_activity',
            key: "total_secondary_activity"
        },
        {
            title: "Conversion rate to completed activities",
            dataIndex: 'conversion_rate',
            key: "conversion_rate"
        },
        {
            title: "Average days from completed activity",
            dataIndex: 'average_days',
            key: "average_days"
        }
    ],
    group_by_occurence: [
        {
            title: "Occurence",
            dataIndex: "occurence",
        },
        {
            title: "Total Completed Order Rows",
            dataIndex: 'total_primary_activity',
            key: "total_primary_activity"
        },
        {
            title: "Total Completed Activity Rows",
            dataIndex: 'total_secondary_activity',
            key: "total_secondary_activity"
        },
        {
            title: "Conversion rate to completed activities",
            dataIndex: 'conversion_rate',
            key: "conversion_rate"
        },
        {
            title: "Average days from completed activity",
            dataIndex: 'average_days',
            key: "average_days"
        }
    ],
    group_by_activity_repeated_at: [
        {
            title: "Activity Repeated at",
            render: (activity_repeated_at) => moment(activity_repeated_at).format('ll'),
            dataIndex: "activity_repeated_at",
        },
        {
            title: "Total Completed order Rows",
            dataIndex: 'total_primary_activity',
            key: "total_primary_activity"
        },
        {
            title: "Total Completed Activity Rows",
            dataIndex: 'total_secondary_activity',
            key: "total_secondary_activity"
        },
        {
            title: "Conversion rate to completed activities",
            dataIndex: 'conversion_rate',
            key: "conversion_rate"
        },
        {
            title: "Average days from completed activity",
            dataIndex: 'average_days',
            key: "average_days"
        }
    ],

    day: [
        {
            title: "Group by Day",
            render:(ts) => moment(ts).format('ll'),
            dataIndex: "ts",
            key: "ts"
        },
        {
            title: "Total Activity Repeated at Rows",
            dataIndex: 'total_primary_activity',
            key: "total_primary_activity"
        },
        {
            title: "Total Revenue Impact",
            dataIndex: 'sum',
            key: "sum"
        },
        {
            title: "Total Completed Activity Rows",
            dataIndex: 'total_secondary_activity',
            key: "total_secondary_activity"
        },
        {
            title: "Conversion rate to completed activities",
            dataIndex: 'conversion_rate',
            key: "conversion_rate"
        },
        {
            title: "Average days from completed activity",
            dataIndex: 'average_days',
            key: "average_days"
        }
    ],

    week: [
        {
            title: "Group by Week",
            render:(ts) => moment(ts).format('ll'),
            dataIndex: "ts",
            key: "ts"
        },
        {
            title: "Total Activity Repeated at Rows",
            dataIndex: 'total_primary_activity',
            key: "total_primary_activity"
        },
        {
            title: "Total Revenue Impact",
            dataIndex: 'sum',
            key: "sum"
        },
        {
            title: "Total Completed Activity Rows",
            dataIndex: 'total_secondary_activity',
            key: "total_secondary_activity"
        },
        {
            title: "Conversion rate to completed activities",
            dataIndex: 'conversion_rate',
            key: "conversion_rate"
        },
        {
            title: "Average days from completed activity",
            dataIndex: 'average_days',
            key: "average_days"
        }
    ],

    month: [
        {
            title: "Group by Month",
            render:(ts) => moment(ts).format('ll'),
            dataIndex: "ts",
            key: "ts"
        },
        {
            title: "Total Activity Repeated at Rows",
            dataIndex: 'total_primary_activity',
            key: "total_primary_activity"
        },
        {
            title: "Total Revenue Impact",
            dataIndex: 'sum',
            key: "sum"
        },
        {
            title: "Total Completed Activity Rows",
            dataIndex: 'total_secondary_activity',
            key: "total_secondary_activity"
        },
        {
            title: "Conversion rate to completed activities",
            dataIndex: 'conversion_rate',
            key: "conversion_rate"
        },
        {
            title: "Average days from completed activity",
            dataIndex: 'average_days',
            key: "average_days"
        }
    ],

    year: [
        {
            title: "Group by Year",
            render:(ts) => moment(ts).format('ll'),
            dataIndex: "ts",
            key: "ts"
        },
        {
            title: "Total Activity Repeated at Rows",
            dataIndex: 'total_primary_activity',
            key: "total_primary_activity"
        },
        {
            title: "Total Revenue Impact",
            dataIndex: 'sum',
            key: "sum"
        },
        {
            title: "Total Completed Activity Rows",
            dataIndex: 'total_secondary_activity',
            key: "total_secondary_activity"
        },
        {
            title: "Conversion rate to completed activities",
            dataIndex: 'conversion_rate',
            key: "conversion_rate"
        },
        {
            title: "Average days from completed activity",
            dataIndex: 'average_days',
            key: "average_days"
        }
    ]
}