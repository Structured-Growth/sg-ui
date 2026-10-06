import { forwardRef } from "react";
import { Surface, type SurfaceProps } from "../Surface/Surface";
import { Box, type BoxProps } from "../Box/Box";
export interface CardProps extends SurfaceProps {}
export const Card = forwardRef<HTMLElement, CardProps>(function Card({ as = "article", variant = "outlined", ...props }, ref) {
  return <Surface {...props} as={as} variant={variant} ref={ref} />;
});
export interface CardContentProps extends BoxProps {}
export const CardContent = forwardRef<HTMLElement, CardContentProps>(function CardContent({ padding = 4, ...props }, ref) {
  return <Box {...props} padding={padding} ref={ref} />;
});
