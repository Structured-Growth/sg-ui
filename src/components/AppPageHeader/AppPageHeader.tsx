import Link from "../../adapters/Link";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { type MouseEvent, type ReactNode, useMemo, useState } from "react";

export type AppPageHeaderBreadcrumb = {
  label: string;
  href?: string;
};

export type AppPageHeaderMetaItem = {
  id?: string;
  icon?: ReactNode;
  label: string;
};

export type AppPageHeaderMenuItem = {
  id?: string;
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
};

export type AppPageHeaderProps = {
  title: string;
  breadcrumbs?: AppPageHeaderBreadcrumb[];
  description?: string;
  metaItems?: AppPageHeaderMetaItem[];
  moreMenuItems?: AppPageHeaderMenuItem[];
  actionButtons?: ReactNode;
};

export function AppPageHeader({
  title,
  breadcrumbs,
  description,
  metaItems = [],
  moreMenuItems = [],
  actionButtons,
}: AppPageHeaderProps) {
  const [breadcrumbMenuAnchor, setBreadcrumbMenuAnchor] = useState<HTMLElement | null>(null);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<HTMLElement | null>(null);
  const hasCollapsedBreadcrumbs = (breadcrumbs?.length ?? 0) > 3;
  const hasMetaItems = metaItems.length > 0;
  const hasActionButtons = Boolean(actionButtons);
  const hasMoreMenuItems = !hasActionButtons && moreMenuItems.length > 0;
  const secondToLastBreadcrumb = hasCollapsedBreadcrumbs && breadcrumbs ? breadcrumbs[breadcrumbs.length - 2] : undefined;
  const collapsedBreadcrumbs = useMemo(
    () => (hasCollapsedBreadcrumbs && breadcrumbs ? breadcrumbs.slice(1, -2) : []),
    [breadcrumbs, hasCollapsedBreadcrumbs],
  );
  const firstBreadcrumb = hasCollapsedBreadcrumbs && breadcrumbs ? breadcrumbs[0] : undefined;
  const lastBreadcrumb = hasCollapsedBreadcrumbs && breadcrumbs ? breadcrumbs[breadcrumbs.length - 1] : undefined;
  const handleOpenBreadcrumbMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setBreadcrumbMenuAnchor(event.currentTarget);
  };
  const handleCloseBreadcrumbMenu = () => {
    setBreadcrumbMenuAnchor(null);
  };
  const handleOpenMoreMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setMoreMenuAnchor(event.currentTarget);
  };
  const handleCloseMoreMenu = () => {
    setMoreMenuAnchor(null);
  };

  return (
    <Box
      sx={{
        bgcolor: "action.hover",
        borderBottom: 1,
        borderColor: "divider",
        px: 3,
        py: 2,
      }}
    >
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <Stack sx={{ mb: 1 }}>
          <Breadcrumbs aria-label="breadcrumbs" separator="›">
            {hasCollapsedBreadcrumbs && firstBreadcrumb ? (
              firstBreadcrumb.href ? (
                <Typography component={Link} href={firstBreadcrumb.href} sx={{ color: "text.primary", textDecoration: "none" }} variant="h6">
                  {firstBreadcrumb.label}
                </Typography>
              ) : (
                <Typography variant="h6">{firstBreadcrumb.label}</Typography>
              )
            ) : null}

            {hasCollapsedBreadcrumbs ? (
              <IconButton aria-label="Show path" onClick={handleOpenBreadcrumbMenu} size="small">
                <MoreHorizIcon fontSize="small" />
              </IconButton>
            ) : null}

            {hasCollapsedBreadcrumbs && secondToLastBreadcrumb ? (
              secondToLastBreadcrumb.href ? (
                <Typography component={Link} href={secondToLastBreadcrumb.href} sx={{ color: "text.primary", textDecoration: "none" }} variant="h6">
                  {secondToLastBreadcrumb.label}
                </Typography>
              ) : (
                <Typography variant="h6">{secondToLastBreadcrumb.label}</Typography>
              )
            ) : null}

            {hasCollapsedBreadcrumbs && lastBreadcrumb ? (
              <Typography variant="h6">{lastBreadcrumb.label}</Typography>
            ) : null}

            {!hasCollapsedBreadcrumbs
              ? breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;

                  if (crumb.href && !isLast) {
                    return (
                      <Typography
                        component={Link}
                        href={crumb.href}
                        key={`${crumb.label}-${index}`}
                        sx={{ color: "text.primary", textDecoration: "none" }}
                        variant="h6"
                      >
                        {crumb.label}
                      </Typography>
                    );
                  }

                  return (
                    <Typography key={`${crumb.label}-${index}`} variant="h6">
                      {crumb.label}
                    </Typography>
                  );
                })
              : null}
          </Breadcrumbs>

          {hasCollapsedBreadcrumbs ? (
            <Menu
              MenuListProps={{ dense: true }}
              anchorEl={breadcrumbMenuAnchor}
              open={Boolean(breadcrumbMenuAnchor)}
              onClose={handleCloseBreadcrumbMenu}
            >
              {collapsedBreadcrumbs.map((crumb, index) => (
                crumb.href ? (
                  <MenuItem
                    component={Link}
                    href={crumb.href}
                    key={`${crumb.label}-${index}`}
                    onClick={handleCloseBreadcrumbMenu}
                    sx={{ minHeight: 30 }}
                  >
                    {crumb.label}
                  </MenuItem>
                ) : (
                  <MenuItem key={`${crumb.label}-${index}`} onClick={handleCloseBreadcrumbMenu} sx={{ minHeight: 30 }}>
                    {crumb.label}
                  </MenuItem>
                )
              ))}
            </Menu>
          ) : null}
        </Stack>
      ) : null}

      <Box
        sx={{
          alignItems: "stretch",
          columnGap: 2,
          display: "grid",
          gridTemplateColumns: hasMetaItems
            ? (hasActionButtons
              ? "minmax(0, 1fr) minmax(0, 200px) minmax(0, 200px)"
              : (hasMoreMenuItems
                ? "minmax(0, 1fr) minmax(0, 200px) 56px"
                : "minmax(0, 1fr) minmax(0, 200px)"))
            : (hasActionButtons
              ? "minmax(0, 1fr) minmax(0, 200px)"
              : (hasMoreMenuItems ? "minmax(0, 1fr) 56px" : "minmax(0, 1fr)")),
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography component="h1" sx={{ fontSize: { xs: 48, md: 64 }, fontWeight: 500 }}>
            {title}
          </Typography>
          {description ? (
            <Typography sx={{ mt: 0.5 }} variant="h5">
              {description}
            </Typography>
          ) : null}
        </Box>

        {hasMetaItems ? (
          <Stack justifyContent="center" spacing={1} sx={{ borderLeft: 1, borderColor: "divider", pl: 2 }}>
            {metaItems.map((item, index) => (
              <Stack alignItems="center" direction="row" key={item.id ?? `${item.label}-${index}`} spacing={0.75}>
                {item.icon}
                <Typography variant="body2">
                  {item.label}
                </Typography>
              </Stack>
            ))}
          </Stack>
        ) : null}

        {hasActionButtons ? (
          <Box sx={{ alignItems: "flex-start", display: "flex", justifyContent: "flex-end" }}>
            {actionButtons}
          </Box>
        ) : null}

        {hasMoreMenuItems ? (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton aria-label="More actions" onClick={handleOpenMoreMenu} size="small" sx={{ alignSelf: "flex-start" }}>
              <MoreVertIcon fontSize="medium" />
            </IconButton>
          </Box>
        ) : null}
      </Box>

      {hasMoreMenuItems ? (
        <Menu
          MenuListProps={{ dense: true }}
          anchorEl={moreMenuAnchor}
          open={Boolean(moreMenuAnchor)}
          onClose={handleCloseMoreMenu}
        >
          {moreMenuItems.map((item, index) => {
            const key = item.id ?? `${item.label}-${index}`;
            const handleClick = () => {
              handleCloseMoreMenu();
              item.onClick?.();
            };

            if (item.href) {
              return (
                <MenuItem
                  component={Link}
                  disabled={item.disabled}
                  href={item.href}
                  key={key}
                  onClick={handleClick}
                  sx={{ color: item.danger ? "error.main" : undefined, minHeight: 30 }}
                >
                  {item.label}
                </MenuItem>
              );
            }

            return (
              <MenuItem
                disabled={item.disabled}
                key={key}
                onClick={handleClick}
                sx={{ color: item.danger ? "error.main" : undefined, minHeight: 30 }}
              >
                {item.label}
              </MenuItem>
            );
          })}
        </Menu>
      ) : null}
    </Box>
  );
}
