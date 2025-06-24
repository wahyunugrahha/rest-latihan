import { web } from "./application/web.js";

web.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000/`);
});
