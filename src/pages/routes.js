import PageNotFound from "./page-not-found/page-not-found.component";
import PageNotPermitted from "./page-not-found/page-restriction.component";
import ComingSoon from "./coming-soon/coming-soon.component";

// Loop through all the folder in pages and collect all the route.js files
// and add them to the routes array.
let routes = [];
const context = require.context("./", true, /route.js$/);
context.keys().forEach((path) => {
  let objRoutes = context(`${path}`).default;
  if (objRoutes && objRoutes.length > 0) {
    objRoutes.forEach((route) => {
      routes.push(route);
    });
  } else {
    routes.push(objRoutes);
  }
});

routes = routes.sort((a, b) => a.position - b.position);
var uniqueRoutes = [...new Set(routes)];
routes = uniqueRoutes;

const pageNotPermitted = {
  key: "app.pageNotPermitted",
  position: 0,
  path: "/page-not-permitted",
  name: "Page not Permitted",
  isMenu: false,
  exact: true,
  auth: false,
  permission: "public",
  component: PageNotPermitted,
  child: [],
};

const pageComingSoon = {
  key: "app.pageComingSoon",
  position: 0,
  path: "/coming-soon",
  name: "coming-soon",
  isMenu: false,
  exact: true,
  auth: false,
  permission: "public",
  component: ComingSoon,
  child: [],
};

const pageNotFoundRoute = {
  key: "app.pageNoteFound",
  position: 0,
  path: "",
  name: "Page not found",
  isMenu: false,
  exact: true,
  auth: false,
  permission: "public",
  component: PageNotFound,
  child: [],
};

routes.push(pageNotPermitted);
routes.push(pageComingSoon);
routes.push(pageNotFoundRoute);

export default routes;
