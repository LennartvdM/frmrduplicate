// Shared components for CMS-ready sidebar sections
export { default as SidebarLayout } from './SidebarLayout';
export { default as SidebarItem } from './SidebarItem';
export { default as ContentSection } from './ContentSection';
export { default as BlogPage, BLOG_PAGE_STYLE } from './BlogPage';

// Animation utilities
export {
  INDICATOR_VARIANTS,
  indicatorTransition,
  createSectionVariants,
  createSidebarMotion,
  smoothScrollTo,
  scrollToSection,
} from './animations';
