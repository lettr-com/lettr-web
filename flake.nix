{
  description = "lettr-web development environment";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs =
    { self, nixpkgs }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "aarch64-darwin"
        "x86_64-darwin"
      ];
      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
    in
    {
      devShells = forAllSystems (pkgs: {
        default = pkgs.mkShell {
          packages = [
            pkgs.nodejs_22 # .nvmrc
            pkgs.pnpm_10 # package.json packageManager (pnpm 10)
          ];

          shellHook = ''
            export LETTR_WEB_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

            # Use the Nix pnpm as is: switching to the exact packageManager version
            # downloads a prebuilt binary that NixOS cannot run.
            export npm_config_manage_package_manager_versions=false

            # `vp` (Vite+) comes from the vite-plus devDependency, so
            # `pnpm install` is all it takes to get it on PATH.
            export PATH="$LETTR_WEB_ROOT/node_modules/.bin:$PATH"

            # Port block convention shared with the other projects (lettr owns
            # 40000, topol 50000): lettr-web takes 60000, so its dev server is
            # on 65173. Override in .envrc.local (`export LETTR_WEB_PORT_BASE=...`).
            export LETTR_WEB_PORT_BASE="''${LETTR_WEB_PORT_BASE:-60000}"
            export LETTR_WEB_PORT="''${LETTR_WEB_PORT:-$((LETTR_WEB_PORT_BASE + 5173))}"

            # Generic project banner / tmux launcher convention.
            export DEV_NAME=lettr-web
            export DEV_URL="http://localhost:$LETTR_WEB_PORT"
            export DEV_INFO="static SvelteKit site · port block $LETTR_WEB_PORT_BASE ($LETTR_WEB_ROOT)"
            export DEV_START="pnpm install && vp dev --port $LETTR_WEB_PORT --strictPort"
            if [ -t 2 ] && [ -z "''${DEV_BANNER_HOOK:-}" ]; then
              printf '\n  \033[1mlettr-web\033[0m  →  \033[1;4m%s\033[0m   start: %s\n\n' "$DEV_URL" "$DEV_START" >&2
            fi
          '';
        };
      });
    };
}
