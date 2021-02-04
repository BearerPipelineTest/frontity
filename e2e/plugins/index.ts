import { initPlugin } from "cypress-plugin-snapshots/plugin";
import execa from "execa";

/**
 * Installs a WordPress plugin.
 * Oficial WP CLI docs: https://developer.wordpress.org/cli/commands/plugin/install/.
 *
 * @returns Null if successful. Throws an error otherwise.
 */
interface InstallPlugin {
  /**
   * The name of the plugin.
   */
  name: string;

  /**
   * The version of the plugin.
   */
  version?: string;
}

/**
 * Update an option value using the WP CLI.
 * You use this task to update any option listed in:
 * https://developer.wordpress.org/cli/commands/option/list/.
 *
 * @returns Null if successful. Throws an error otherwise.
 */
interface UpdateOption {
  /**
   * The name of the option.
   */
  name: string;

  /**
   * The value to set for the option.
   */
  value: any;
}

/**
 * Loads a new database from an SQL dump file.
 *
 * @returns Null if successful. Throws an error otherwise.
 */
interface LoadDatabase {
  /**
   * The path where the database SQL file is located. Relative to
   * the `e2e` folder.
   */
  path: string;
}

const tasks = {
  installPlugin({ name, version }: InstallPlugin) {
    return (async () => {
      await execa.command(
        `docker-compose run --rm wpcli wp plugin install ${name}${
          version ? ` --version=${version}` : ""
        }`,
        { stdio: "inherit" }
      );
      return null;
    })();
  },

  loadDatabase({ path }: LoadDatabase) {
    return (async () => {
      await execa.command(
        `docker-compose exec -T db mysql -uroot -ppassword wordpress < ${path}`,
        {
          stdio: "inherit",
          // Because we use file redirection (the "<") in the command.
          shell: true,
        }
      );
      return null;
    })();
  },

  /**
   * Loads the default database.
   *
   * @returns Null if successful. Throws an error otherwise.
   */
  resetDatabase() {
    return (async () => {
      await execa.command(
        "docker-compose exec -T db mysql -uroot -ppassword wordpress < ./wp-data/default-db.sql",
        {
          stdio: "inherit",
          // Because we use file redirection (the "<") in the command.
          shell: true,
        }
      );
      return null;
    })();
  },

  /**
   * Removes all the WordPress plugins.
   *
   * Official WP CLI Docs: https://developer.wordpress.org/cli/commands/plugin/delete/.
   *
   * @returns Null if successful. Throws an error otherwise.
   */
  removeAllPlugins() {
    return (async () => {
      await execa.command(
        `docker-compose run --rm wpcli wp plugin delete --all`,
        {
          stdio: "inherit",
        }
      );
      return null;
    })();
  },

  updateOption({ name, value }: UpdateOption) {
    return (async () => {
      await execa(
        "docker-compose",
        ["run", "--rm", "wpcli", "wp", "option", "update", name, value],
        {
          stdio: "inherit",
        }
      );
      return null;
    })();
  },
};

/**
 * The utility type which facilitates extracting the types for the
 * individual cypress tasks.
 */
export type taskTypes = <T extends keyof typeof tasks>(
  event: T,
  arg?: Parameters<typeof tasks[T]>[0],
  options?: Partial<Cypress.Loggable & Cypress.Timeoutable>
) => Cypress.Chainable<any>;

/**
 * The plugins export.
 *
 * @param on - The callback from Cypress.
 * @param config - The config object from Cypress.
 *
 * @returns The modified config.
 */
module.exports = (on, config) => {
  on("task", tasks);

  /**
   * The initiliazation plugin required for the `cypress-plugin-snapshot`
   * package.
   */
  initPlugin(on, config);

  return config;
};
