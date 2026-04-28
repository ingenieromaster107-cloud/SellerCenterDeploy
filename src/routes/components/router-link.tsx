import React from 'react';
import { Link } from 'react-router';

type LinkBase = React.ComponentProps<typeof Link>;

export type RouterLinkProps = Omit<LinkBase, 'to'> & {
	to?: LinkBase['to'];
	href?: LinkBase['to'];
};

export const RouterLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(
	({ to, href, ...other }, ref) => {
		const resolvedTo = to ?? href ?? '';
		return <Link ref={ref} to={resolvedTo} {...other} />;
	}
);

RouterLink.displayName = 'RouterLink';
