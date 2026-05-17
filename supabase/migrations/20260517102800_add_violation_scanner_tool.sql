-- =====================================================================
-- TikShopDrop — add the Violation Scanner tool to the allowed tool set.
-- =====================================================================

alter table public.generations
  drop constraint if exists generations_tool_check;

alter table public.generations
  add constraint generations_tool_check
  check (
    tool in (
      'ugc-scripts',
      'outreach',
      'copy-optimizer',
      'appeals',
      'creator-matcher',
      'violation-scanner'
    )
  );

alter table public.usage_events
  drop constraint if exists usage_events_tool_check;

alter table public.usage_events
  add constraint usage_events_tool_check
  check (
    tool in (
      'ugc-scripts',
      'outreach',
      'copy-optimizer',
      'appeals',
      'creator-matcher',
      'violation-scanner'
    )
  );
