-- =====================================================================
-- TikShopDrop — extend the supported tool set.
--
-- Adds 'appeals' and 'creator-matcher' to the allowed values of
-- generations.tool and usage_events.tool.
--
-- 'calculator' is intentionally NOT added: the Margin Calculator is a
-- pure client-side math tool that does not call an AI provider and
-- does not produce persisted generations.
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
      'creator-matcher'
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
      'creator-matcher'
    )
  );
