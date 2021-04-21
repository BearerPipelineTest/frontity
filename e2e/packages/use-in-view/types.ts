import { Package } from "frontity/types";

/**
 * Package to do e2e testing of Frontity's UseInView hook.
 */
interface UseInView extends Package {
  /**
   * Package name.
   */
  name: "e2e-use-in-view";

  /**
   * Root components exposed by this package.
   */
  roots: {
    /**
     * UseInView namespace.
     */
    useInView: React.ElementType;
  };
}

export default UseInView;
