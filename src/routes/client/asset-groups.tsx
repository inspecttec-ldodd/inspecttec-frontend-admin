import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/client/asset-groups")({
	component: AssetGroupsLayout,
});

function AssetGroupsLayout() {
	return <Outlet />;
}
