import moment from 'moment'

 export const group_by_columns = {
    group_by_activityid: [
        {
            title: "ActivityId",
            dataIndex: "activity_id",
            key: "id"
        },
        {
            title: "Total Revenue Impact",
            dataIndex: 'total_revenue_impact',
            key: "total_revenue_impact"
        },
    ],

    group_by_customer: [
        {
            title: "Customer",
            dataIndex: "customer",
            key: 'customer'
        },
        {
            title: "Total Revenue Impact",
            dataIndex: "total_revenue_impact",
            key: 'total_revenue_impact'
        },
    ],

    group_by_timestamp: [
        {
            title: "Timestamp",
            dataIndex: "ts",
            render: (ts) => moment(ts).format('ll'),
            key: "ts"
        },
        {
            title: " Total Revenue impact",
            dataIndex: "total_revenue_impact",
            key: "total_revenue_impact"
        },
    ],

    group_by_source: [
        {
            title: "Source",
            dataIndex: "source",
            key: "source"
        },
        {
            title: " Total Revenue impact",
            dataIndex: "total_revenue_impact",
            key: "total_revenue_impact"
        },
    ],

    group_by_sourceid: [
        {
            title: "SourceId",
            dataIndex: "source_id",
            key: "source_id"
        },
        {
            title: "Total Revenue impact",
            dataIndex: "total_revenue_impact",
            key: "total_revenue_impact"
        },
    ],

    group_by_activity: [
        {
            title: "Activity",
            dataIndex: "activity",
            key: "activity"
        },
        {
            title: "Total Revenue Impact",
            dataIndex: "total_revenue_impact",
        },
    ],

    group_by_feature1: [
        {
            title: "Feature1",
            dataIndex: "feature_1",
            key: "feature_1"
        },
        {
            title: "Total Revenue Impact",
            dataIndex: "total_revenue_impact",
            key: "total_revenue_impact"
        },
    ],

    group_by_feature2: [
        {
            title: "Feature2",
            dataIndex: "feature_2",
        },
        {
            title: "Total Revenue Impact",
            dataIndex: "total_revenue_impact"
        },
    ],

    group_by_feature3: [
        {
            title: "Feature3",
            dataIndex: "feature_3",
        },
        {
            title: "Total Revenue Impact",
            dataIndex: "total_revenue_impact"
        }
    ],

    group_by_revenue_impact: [
        {
            title: "Revenue Impact",
            dataIndex: "revenue_impact"
        },
        {
            title: "Total Revenue Impact rows",
            dataIndex: "total_revenue_impact"
        },
    ],
    group_by_link: [
        {
            title: "Link",
            dataIndex: "link",
        },
        {
            title: "Total Revenue Impact",
            dataIndex: "total_revenue_impact"
        },
    ],
    group_by_occurence: [
        {
            title: "Occurence",
            dataIndex: "occurence",
        },
    ],
    group_by_activity_repeated_at: [
        {
            title: "Activity Repeated at",
            render: (activity_repeated_at) => moment(activity_repeated_at).format('ll'),
            dataIndex: "activity_repeated_at",
        },
    ],

    day: [
        {
            title: "Group by Day",
            render:(ts) => moment(ts).format('ll'),
            dataIndex: "ts",
            key: "ts"
        },
        {
            title: "Total Revenue Impact",
            dataIndex: 'total_revenue_impact',
            key: "total_revenue_impact"
        },
    ],

    week: [
        {
            title: "Group by Week",
            render:(ts) => moment(ts).format('ll'),
            dataIndex: "ts",
            key: "ts"
        },
        {
            title: "Total Revenue Impact",
            dataIndex: 'total_revenue_impact',
            key: "total_revenue_impact"
        },
    ],

    month: [
        {
            title: "Group by Month",
            render:(ts) => moment(ts).format('ll'),
            dataIndex: "ts",
            key: "ts"
        },
        {
            title: "Total Revenue Impact",
            dataIndex: 'total_revenue_impact',
            key: "total_revenue_impact"
        },
    ],

    year: [
        {
            title: "Group by Year",
            render:(ts) => moment(ts).format('ll'),
            dataIndex: "ts",
            key: "ts"
        },
        {
            title: "Total Revenue Impact",
            dataIndex: 'total_revenue_impact',
            key: "total_revenue_impact"
        },
    ]
}