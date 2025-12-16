import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    return (
        <div className="p-2">
            <h1 className="text-2xl font-bold mb-4">Welcome to the Admin Portal</h1>
            <p>Select a client or manage global settings from the menu.</p>
        </div>
    )
}
