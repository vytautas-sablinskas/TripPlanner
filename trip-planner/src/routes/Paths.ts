const Paths = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    TRIPS: '/trips',
    CREATE_TRIP: '/trips/create',
    EDIT_TRIP: '/trips/:id/edit',
    TRIP_DETAILS: '/trips/:id',
    TRIP_DETAILS_CREATE: '/trips/:id/create',
    TRIP_DETAILS_EDIT: '/trips/:tripId/edit/:planId',
    TRIP_DETAILS_VIEW: '/trips/:tripId/plan/:planId',
    BUDGETS: '/trips/:tripId/budgets',
    CREATE_BUDGET: '/trips/:tripId/budgets/create',
    EDIT_BUDGET: '/trips/:tripId/budgets/:budgetId/edit',
    TRIP_TRAVELLERS_VIEW: '/trips/:tripId/participants',
    TRIP_TRAVELLERS_CREATE: '/trips/:tripId/participants/create',
    NOTIFICATIONS: '/notifications',
    PROFILE: '/profile',
    EXPORT_TRIP: '/trips/:tripId/export',
    RECOMMENDATIONS: '/recommendations',
}

export default Paths